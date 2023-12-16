const task31 = () => {
  //Task 3.1
  class Graph {
    constructor(vertices) {
      this.vertices = vertices;
      this.adjList = new Map();
      this.visited = new Array(vertices).fill(false);
      this.components = [];
      this.colors = new Array(vertices).fill(-1);
    }

    addEdge(u, v) {
      if (!this.adjList.has(u)) {
        this.adjList.set(u, []);
      }
      if (!this.adjList.has(v)) {
        this.adjList.set(v, []);
      }
      this.adjList.get(u).push(v);
      this.adjList.get(v).push(u);
    }

    dfs(v, component) {
      this.visited[v] = true;
      component.push(v);

      const neighbors = this.adjList.get(v);
      for (const neighbor of neighbors) {
        if (!this.visited[neighbor]) {
          this.dfs(neighbor, component);
        }
      }
    }

    findConnectedComponents() {
      for (let v = 0; v < this.vertices; v++) {
        if (!this.visited[v]) {
          const component = [];
          this.dfs(v, component);
          this.components.push(component);
        }
      }
      return this.components;
    }

    isEulerian() {
      for (const component of this.components) {
        if (component.length > 0) {
          const degree = this.adjList.get(component[0]).length;
          if (component.length % 2 !== 0 || degree % 2 !== 0) {
            return false;
          }
        }
      }
      return true;
    }

    findEulerianCycle() {
      if (!this.isEulerian()) {
        return null;
      }

      const cycle = [];
      const stack = [];
      stack.push(0);

      while (stack.length > 0) {
        const currentVertex = stack[stack.length - 1];
        if (this.adjList.get(currentVertex).length > 0) {
          const nextVertex = this.adjList.get(currentVertex).shift();
          stack.push(nextVertex);

          const neighbors = this.adjList.get(nextVertex);
          const index = neighbors.indexOf(currentVertex);
          if (index !== -1) {
            neighbors.splice(index, 1);
          }
        } else {
          stack.pop();
          cycle.push(currentVertex);
        }
      }

      return cycle;
    }

    isBipartite() {
      const queue = [];

      for (let v = 0; v < this.vertices; v++) {
        if (this.colors[v] === -1) {
          this.colors[v] = 1;
          queue.push(v);

          while (queue.length > 0) {
            const currentVertex = queue.shift();
            const neighbors = this.adjList.get(currentVertex);

            for (const neighbor of neighbors) {
              if (this.colors[neighbor] === -1) {
                this.colors[neighbor] = 1 - this.colors[currentVertex];
                queue.push(neighbor);
              } else if (this.colors[neighbor] === colors[currentVertex]) {
                return false;
              }
            }
          }
        }
      }

      return true;
    }

    findBipartition() {
      if (!this.isBipartite()) {
        return null;
      }

      const partition = [[], []];
      for (let v = 0; v < this.vertices; v++) {
        partition[this.colors[v]].push(v);
      }

      return partition;
    }
  }

  const graph = new Graph(8);

  graph.addEdge(0, 1);
  graph.addEdge(0, 3);
  graph.addEdge(1, 2);
  graph.addEdge(1, 4);
  graph.addEdge(2, 5);
  graph.addEdge(3, 4);
  graph.addEdge(4, 5);
  graph.addEdge(4, 6);
  graph.addEdge(5, 7);
  graph.addEdge(6, 7);

  const components = graph.findConnectedComponents();
  console.log('Компоненты связности:', components);

  const isEulerian = graph.isEulerian();
  console.log('Граф эйлеров?', isEulerian);

  if (isEulerian) {
    const eulerianCycle = graph.findEulerianCycle();
    console.log('Эйлеров цикл:', eulerianCycle);
  }

  const isBipartite = graph.isBipartite();
  console.log('двудольный граф?', isBipartite);

  if (isBipartite) {
    const bipartition = graph.findBipartition();
    console.log('Разбиение на доли:', bipartition);
  }
};
const task32_1 = () => {
  // Task 3.2
  // Part 1
  function findFireStationLocation(graph, roads) {
    const distances = new Array(graph.length).fill(Infinity);
    distances[0] = 0;

    const queue = [0];

    while (queue.length > 0) {
      const current = queue.shift();

      for (let road = 0; road < roads.length; road++) {
        if (roads[road].start === current) {
          const neighbor = roads[road].end;
          const time = roads[road].time;

          if (distances[current] + time < distances[neighbor]) {
            distances[neighbor] = distances[current] + time;
            queue.push(neighbor);
          }
        }
      }
    }

    let maxDistance = 0;
    let fireStation = -1;

    for (let intersection = 0; intersection < graph.length; intersection++) {
      if (distances[intersection] > maxDistance) {
        maxDistance = distances[intersection];
        fireStation = intersection;
      }
    }

    return fireStation;
  }

  const N = 5; // Количество перекрестков
  const M = 7; // Количество дорог

  const graph = new Array(N).fill(0).map(() => new Array(M).fill(0));
  const roads = [
    { start: 0, end: 1, time: 5 },
    { start: 0, end: 2, time: 10 },
    { start: 1, end: 2, time: 2 },
    { start: 1, end: 3, time: 8 },
    { start: 2, end: 3, time: 1 },
    { start: 2, end: 4, time: 7 },
    { start: 3, end: 4, time: 3 },
  ];

  const fireStationLocation = findFireStationLocation(graph, roads);
  console.log('Перекресток для пожарной станции:', fireStationLocation);
};
const task32_2 = () => {
  //  Task 3.2
  // Part 2
  function findFireStationLocation(graph, roads) {
    const visited = new Array(graph.length).fill(false);
    const distances = new Array(graph.length).fill(Infinity);
    const parent = new Array(graph.length).fill(-1);

    distances[0] = 0;

    for (let i = 0; i < graph.length - 1; i++) {
      const minIndex = findMinDistance(distances, visited);
      visited[minIndex] = true;

      for (let j = 0; j < graph.length; j++) {
        if (
          graph[minIndex][j] !== 0 &&
          !visited[j] &&
          graph[minIndex][j] < distances[j]
        ) {
          parent[j] = minIndex;
          distances[j] = graph[minIndex][j];
        }
      }
    }

    let maxDistance = 0;
    let fireStation = -1;

    for (let i = 1; i < graph.length; i++) {
      if (distances[i] > maxDistance) {
        maxDistance = distances[i];
        fireStation = i;
      }
    }

    return fireStation;
  }

  function findMinDistance(distances, visited) {
    let minDistance = Infinity;
    let minIndex = -1;

    for (let i = 0; i < distances.length; i++) {
      if (!visited[i] && distances[i] < minDistance) {
        minDistance = distances[i];
        minIndex = i;
      }
    }

    return minIndex;
  }

  // Пример использования:
  const N = 5; // Количество перекрестков
  const M = 7; // Количество дорог

  const graph = new Array(N).fill(0).map(() => new Array(N).fill(0));
  const roads = [
    { start: 0, end: 1, time: 5 },
    { start: 0, end: 2, time: 10 },
    { start: 1, end: 2, time: 2 },
    { start: 1, end: 3, time: 8 },
    { start: 2, end: 3, time: 1 },
    { start: 2, end: 4, time: 7 },
    { start: 3, end: 4, time: 3 },
  ];

  for (let i = 0; i < roads.length; i++) {
    const { start, end, time } = roads[i];
    graph[start][end] = time;
    graph[end][start] = time;
  }

  const fireStationLocation = findFireStationLocation(graph, roads);
  console.log('Перекресток для пожарной станции:', fireStationLocation);
};
const task33 = () => {
  //  Task 3.3
  function getMinimumSpanningTree(nodes, edges) {
    const graph = {};
    for (let node of nodes) {
      graph[node] = [];
    }
    for (let edge of edges) {
      const [node1, node2, cost] = edge;
      graph[node1].push({ node: node2, cost });
      graph[node2].push({ node: node1, cost });
    }

    const mst = [];
    const visited = new Set();
    visited.add(nodes[0]);

    while (visited.size < nodes.length) {
      let minEdge = [null, null, Infinity];
      for (let node of visited) {
        for (let edge of graph[node]) {
          if (!visited.has(edge.node) && edge.cost < minEdge[2]) {
            minEdge = [node, edge.node, edge.cost];
          }
        }
      }

      mst.push(minEdge);
      visited.add(minEdge[1]);
    }

    return mst;
  }

  function getMinimumSpanningTreeKruskal(nodes, edges) {
    edges.sort((a, b) => a[2] - b[2]);
    const parent = {};
    for (let node of nodes) {
      parent[node] = node;
    }

    function find(node) {
      if (parent[node] !== node) {
        parent[node] = find(parent[node]);
      }
      return parent[node];
    }

    function union(node1, node2) {
      parent[find(node1)] = find(node2);
    }

    const mst = [];
    for (let edge of edges) {
      const [node1, node2, cost] = edge;
      if (find(node1) !== find(node2)) {
        mst.push(edge);
        union(node1, node2);
      }
    }

    return mst;
  }

  const nodes = ['A', 'B', 'C', 'D', 'E'];
  const edges = [
    ['A', 'B', 5],
    ['A', 'C', 10],
    ['B', 'C', 20],
    ['B', 'D', 5],
    ['C', 'D', 15],
    ['C', 'E', 8],
    ['D', 'E', 12],
  ];

  const primMst = getMinimumSpanningTree(nodes, edges);
  console.log("Minimum Spanning Tree (Prim's Algorithm):", primMst);

  const kruskalMst = getMinimumSpanningTreeKruskal(nodes, edges);
  console.log("Minimum Spanning Tree (Kruskal's Algorithm):", kruskalMst);
};
const task34 = () => {
  //Task 3.4
  function assignTasks(employees, tasks) {
    const taskToEmployee = new Map();
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const suitableEmployees = employees.filter((employee) =>
        employee.tasks.includes(task)
      );
      if (suitableEmployees.length === 0) {
        return `Unable to assign task ${task}. Employee training required.`;
      } else {
        taskToEmployee.set(task, suitableEmployees[0]);
        suitableEmployees[0].tasks = suitableEmployees[0].tasks.filter(
          (t) => t !== task
        );
      }
    }
    return taskToEmployee;
  }

  const employees = [
    { id: 1, name: 'Alice', tasks: ['task1'] },
    { id: 2, name: 'Bob', tasks: ['task3'] },
    { id: 3, name: 'Charlie', tasks: ['task2'] },
    { id: 4, name: 'Allah', tasks: ['task4'] },
  ];

  const tasks = ['task1', 'task2', 'task3', 'task4'];

  console.log(assignTasks(employees, tasks));
};
const task35_a = () => {
  //Task 3.5
  //(а)
  function distributeTasksByInterest(employees, tasks) {
    let assignedTasks = new Array(tasks.length).fill(-1);
    let taskAssigned = new Array(employees.length).fill(false);

    for (let i = 0; i < tasks.length; i++) {
      for (let j = 0; j < tasks[i].length; j++) {
        let employee = tasks[i][j];
        if (!taskAssigned[employee]) {
          assignedTasks[i] = employee;
          taskAssigned[employee] = true;
          break;
        }
      }
    }

    return assignedTasks;
  }
};

const task35_b = () => {
  function distributeTasksByEfficiency(employees, tasks) {
    let assignedTasks = new Array(tasks.length).fill(-1);
    let employeeAssigned = new Array(employees.length).fill(false);

    for (let i = 0; i < employees.length; i++) {
      for (let j = 0; j < employees[i].length; j++) {
        let task = employees[i][j];
        if (assignedTasks[task] === -1 && !employeeAssigned[i]) {
          assignedTasks[task] = i;
          employeeAssigned[i] = true;
          break;
        }
      }
    }

    return assignedTasks;
  }
};
