"use strict";

const fs = require('fs');

const numbers = fs.readFileSync('./data.txt', { encoding: 'utf-8' }).split(' ').map(num => parseInt(num, 10));

function assembleTree(numbers) {
  const stack = [];

  const states = {
    READING_HEADER_CHILD_NODES: 0,
    READING_HEADER_META_NODES: 1,
    DESCEND_INTO_CHILDREN: 2,
    ASCEND_FROM_CHILD: 3,
    READING_CHILD_NODES: 4,
    READING_META: 5,
    COMPLETE: 6,
  };

  let state = {
    state: states.READING_HEADER_CHILD_NODES,
    children: [],
    meta: [],
  };

  let metaTotal = 0;

  function getNextNumber() {
    return numbers.shift();
  }

  const root = state;

  loop: while(true) {
    if (state === undefined) {
      console.log(metaTotal);
      return root;
    }
    switch (state.nextState) {
      case states.READING_HEADER_CHILD_NODES: {
        state.childCount = getNextNumber();
        state.nextState = states.READING_HEADER_META_NODES;
        continue;
      }
      case states.READING_HEADER_META_NODES: {
        state.metaCount = getNextNumber();
        state.nextState = states.DESCEND_INTO_CHILDREN;
        continue;
      }
      case states.DESCEND_INTO_CHILDREN: {
        if (state.childCount > 0) {
          state.nextState = states.ASCEND_FROM_CHILD;
          stack.push(state);
          state = { state: states.READING_HEADER_CHILD_NODES, parent: state, children: [], meta: [] }
        } else {
          state.nextState = states.READING_META;
        }
        continue;
      }
      case states.ASCEND_FROM_CHILD: {
        state.childrenRead = (state.childrenRead || 0) + 1;
        if (state.childrenRead === state.childCount) {
          state.nextState = states.READING_META;
        } else {
          state.nextState = states.DESCEND_INTO_CHILDREN;
        }
        continue;
      }
      case states.READING_META: {
        const metaNumber = getNextNumber();
        metaTotal += metaNumber;
        state.meta.push(metaNumber);
        state.metaRead = (state.metaRead || 0) + 1;
        if (state.metaRead === state.metaCount) {
          state.nextState = states.COMPLETE;
          if (state.parent) {
            state.parent.children.push(state);
          }
          state = stack.pop();
        }
        continue;
      }
      default: {
        break loop;
      }
    }
  }
}

const root = assembleTree(numbers);

function calculateValueOfNode(node) {
  if (node.children.length === 0) {
    return node.meta.reduce((acc, meta) => acc + meta, 0);
  }
  return node.meta.reduce((acc, meta) => {
    if (meta === 0) {
      return acc;
    }
    const childIndex = meta - 1;
    if (node.children.length > childIndex) {
      return acc + calculateValueOfNode(node.children[childIndex]);
    }
    return acc;
  }, 0)
}

console.log(calculateValueOfNode(root));
