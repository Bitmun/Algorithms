//Task1
// function binarySearch(arr, x) {
//   let left = 0;
//   let right = arr.length - 1;
//   let count = 0;

//   while (left <= right) {
//     let mid = Math.floor((left + right) / 2);

//     if (arr[mid] === x) {
//       count++;
//       return count;
//     } else if (arr[mid] < x) {
//       left = mid + 1;
//     } else {
//       right = mid - 1;
//     }
//     count++;
//   }
//   return count;
// }

// // Интерполяционный поиск
// function interpolationSearch(arr, x) {
//   let count = 0;
//   let low = 0;
//   let high = arr.length - 1;

//   while (low <= high && x >= arr[low] && x <= arr[high]) {
//     let pos =
//       low +
//       Math.floor(((x - arr[low]) * (high - low)) / (arr[high] - arr[low]));

//     if (arr[pos] === x) {
//       count++;
//       return count;
//     } else if (arr[pos] < x) {
//       low = pos + 1;
//     } else {
//       high = pos - 1;
//     }
//     count++;
//   }
//   return count;
// }

// // Генерация массива случайных чисел
// function generateRandomArray(length, range) {
//   let arr = [];
//   for (let i = 0; i < length; i++) {
//     arr.push(Math.floor(Math.random() * (range + 1)));
//   }
//   return arr.sort((a, b) => a - b);
// }

// // Тестирование алгоритмов
// let arr = generateRandomArray(100, 50);
// let x = Math.floor(Math.random() * 51); // Случайное число от 0 до 50
// console.log('Массив:', arr);
// console.log('Искомое число:', x);
// console.log('Бинарный поиск:', binarySearch(arr, x), 'операций');
// console.log('Интерполяционный поиск:', interpolationSearch(arr, x), 'операций');
console.log('');
//Task2

// class Node {
//   constructor(value) {
//     this.value = value;
//     this.left = null;
//     this.right = null;
//   }
// }

// class BinarySearchTree {
//   constructor() {
//     this.root = null;
//   }

//   insert(value) {
//     const newNode = new Node(value);

//     if (this.root === null) {
//       this.root = newNode;
//     } else {
//       this.insertNode(this.root, newNode);
//     }
//   }

//   insertNode(node, newNode) {
//     if (newNode.value < node.value) {
//       if (node.left === null) {
//         node.left = newNode;
//       } else {
//         this.insertNode(node.left, newNode);
//       }
//     } else {
//       if (node.right === null) {
//         node.right = newNode;
//       } else {
//         this.insertNode(node.right, newNode);
//       }
//     }
//   }

//   inOrderTraversal(node, callback) {
//     if (node !== null) {
//       this.inOrderTraversal(node.left, callback);
//       callback(node.value);
//       this.inOrderTraversal(node.right, callback);
//     }
//   }

//   inOrderReverseTraversal(node, callback) {
//     if (node !== null) {
//       this.inOrderReverseTraversal(node.right, callback);
//       callback(node.value);
//       this.inOrderReverseTraversal(node.left, callback);
//     }
//   }

//   findKthMin(k) {
//     let result = null;
//     let count = 0;

//     const findKth = (node) => {
//       if (node === null || count >= k) return;

//       findKth(node.left);
//       count++;
//       if (count === k) {
//         result = node.value;
//         return;
//       }
//       findKth(node.right);
//     };

//     findKth(this.root);
//     return result;
//   }

//   rebalance() {
//     const nodes = [];
//     const storeNodes = (node) => {
//       if (node === null) return;
//       storeNodes(node.left);
//       nodes.push(node);
//       storeNodes(node.right);
//     };

//     storeNodes(this.root);
//     this.root = this.balanceHelper(nodes, 0, nodes.length - 1);
//   }

//   balanceHelper(nodes, start, end) {
//     if (start > end) return null;

//     const mid = Math.floor((start + end) / 2);
//     const node = nodes[mid];

//     node.left = this.balanceHelper(nodes, start, mid - 1);
//     node.right = this.balanceHelper(nodes, mid + 1, end);

//     return node;
//   }
// }

// // Example usage
// const bst = new BinarySearchTree();
// const sequence = [20, 10, 30, 5, 15, 25, 35];
// sequence.forEach((value) => bst.insert(value));

// console.log('Inorder traversal:');
// bst.inOrderTraversal(bst.root, (value) => console.log(value));

// console.log('\nInorder reverse traversal:');
// bst.inOrderReverseTraversal(bst.root, (value) => console.log(value));

// const k = 4;
// console.log(`\nThe ${k}-th minimum value is:`, bst.findKthMin(k));

// bst.rebalance();
// console.log('\nBST after rebalancing:');
// bst.inOrderTraversal(bst.root, (value) => console.log(value));
console.log('');
//Task3
class HashTable {
  constructor(size) {
    this.size = size;
    this.table = new Array(size);
  }

  hash(key) {
    const A = 0.6180339887;
    return Math.floor(this.size * ((key * A) % 1));
  }

  linearProbe(hashValue, i) {
    return (hashValue + i) % this.size;
  }

  doubleHash(key, i) {
    // Двойное хэширование
    const R = 13; // Вторая хэш-функция (можно подобрать)
    const hash1 = this.hash(key);
    const hash2 = R - (key % R);
    return (hash1 + i * hash2) % this.size;
  }

  insert(key, value) {
    const hashValue = this.hash(key);

    // Проверяем наличие коллизий и разрешаем их
    if (!this.table[hashValue]) {
      // Пустая ячейка, просто вставляем значение
      this.table[hashValue] = [{ key, value }];
    } else {
      // Коллизия, разрешаем с помощью цепочек переполнения
      let i = 1;
      while (this.table[this.linearProbe(hashValue, i)]) {
        i++;
      }
      this.table[this.linearProbe(hashValue, i)] = [{ key, value }];
    }
  }

  search(key) {
    const hashValue = this.hash(key);

    // Проверяем наличие коллизий и ищем значение
    if (this.table[hashValue]) {
      // Поиск в основной ячейке
      for (let i = 0; i < this.table[hashValue].length; i++) {
        if (this.table[hashValue][i].key === key) {
          return this.table[hashValue][i].value;
        }
      }

      // Поиск в ячейках с цепочками переполнения
      let i = 1;
      while (this.table[this.linearProbe(hashValue, i)]) {
        for (
          let j = 0;
          j < this.table[this.linearProbe(hashValue, i)].length;
          j++
        ) {
          if (this.table[this.linearProbe(hashValue, i)][j].key === key) {
            return this.table[this.linearProbe(hashValue, i)][j].value;
          }
        }
        i++;
      }
    }

    return null;
  }
}

// Пример использования

const hashTable = new HashTable(10);

// Вставка значений
hashTable.insert(1, 'Значение 1');
hashTable.insert(11, 'Значение 11');
hashTable.insert(21, 'Значение 21');
hashTable.insert(2, 'Значение 2');
hashTable.insert(1, 'Значение 1');

// Поиск значений
console.log(hashTable.search(1));
console.log(hashTable.search(11));
console.log(hashTable.search(21));
console.log(hashTable.search(2));
console.log(hashTable.search(3));
console.log(hashTable);
