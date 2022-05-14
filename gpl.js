/*
 * My Graph Library implementation in JavaScript
 *
 * (Anthony Audino h1403837@s.wu.ac.at)
/*
 * My Graph Library implementation in JavaScript
 *
 * (Anthony Audino h1403837@s.wu.ac.at)
 *
 * How to run: `js gpl.js`
 */

var Base = Base || {}; /* declare 'Base' namespace */

/*
 * Begin of my implementation
 * ---------------%<------------------
 */
Base.Graph = class Graph {
  //Constructor's default is A Graph from Step 1
  constructor(
    representation = "edgelist", //
    edgetype = "undirected",
    weighted = false,
    dot = false,
    traversal = false
  ) {
    this.representation = representation;
    this.edgetype = edgetype;
    this.weighted = weighted;
    this.dot = dot;
    if (this.representation === "edgelist") {
      this.edges = [];
    }
    this.nodes = [];
    this.traversal = traversal;
  }
  add(m, n, weight = null) {
    //security Checks
    if (!(m instanceof Base.Node) || !(n instanceof Base.Node)) {
      console.log(
        `One of you nodes is not an instance of of the Class Base.Node `
      );
      return false;
    }
    if (this.weighted === true && weight === null) {
      console.log(`please add weight or choose a different Config`);
      return false;
    }

    if (this.weighted === false && weight !== null) {
      console.log(`please remove  weight or choose a different Config`);
      return false;
    }
    if (this.representation == "edgelist") {
      return this.#edgelistadd(m, n, weight);
    } else if (this.representation == "neighborlist") {
      return this.#neighborlistadd(m, n, weight);
    }
  }

  DOT() {
    if (this.dot === false) {
      console.log("The DOT Method is not available with the current Config");
      return false;
    } else {
      if (this.edgetype === "undirected") {
        this.#undirectedDOT();
        return true;
      } else if (this.edgetype === "directed") {
        this.#directedDOT();
        return true;
      }
    }
  }

  DFS(start = null) {
    let tree = new Base.Graph(
      (representation = "edgelist"),
      (edgetype = "undirected"),
      (weighted = false),
      (dot = true),
      (traversal = false)
    );
    let lifostack = [];
    let missingNodes;
    let startvertice = this.nodes.indexOf(start);
    if (start === null) {
      startvertice = [Math.floor(Math.random() * this.nodes.length)];
    }
    console.log(lifostack.length);
    lifostack.push(this.nodes[startvertice]);
    console.log(lifostack.length);
    while (lifostack.length > 0) {
      let topOfTheStack = lifostack[lifostack.length - 1];
      console.log("Lifostack:", topOfTheStack);
      if (this.representation === "edgelist") {
        let test = this.edges.filter(
          (Edge) => Edge.a === topOfTheStack || Edge.b === topOfTheStack
        );
        missingNodes = test.map((el) => (el.a === topOfTheStack ? el.b : el.a));
      } else if (this.representation === "neighborlist") {
        let test = topOfTheStack.neighbors;
        console.log(test);
        missingNodes = test.map((nd) => nd.oppositeNode);
      }
      missingNodes
        .filter((node) => tree.nodes.includes(node))
        .forEach((node) => {
          let idx = missingNodes.indexOf(node);
          missingNodes.splice(idx, 1);
        });
      console.log(missingNodes);
      lifostack.push(...missingNodes);
      console.log("check lifostack", lifostack);
      for (let node of missingNodes) {
        tree.add(topOfTheStack, node);
      }
      console.log("Before splice", lifostack.length, missingNodes.length);
      lifostack.splice(lifostack.length - missingNodes.length - 1, 1);
      console.log("after splice", lifostack.length, missingNodes.length);
    }
    tree.DOT();
    return tree;
  }

  SSSP(startVertex) {
    if (
      this.edgetype === "undirected" ||
      this.weighted === false ||
      this.traversal === false
    ) {
      console.log(
        "this Graph is not directed and/or does not support weights and/or does not support traversal  - Please choose a different config"
      );
      return false;
    }
    if (this.nodes.includes(startVertex) === false) {
      console.log("this node is not part of your Graph");
      return false;
    }
    let treeSSSP = new Base.Graph(
      (representation = "edgelist"),
      (edgetype = "undirected"),
      (weighted = true),
      (dot = true),
      (traversal = false)
    );
    let distance = this.nodes.map((n) =>
      n === startVertex ? [n, 0] : [n, Infinity]
    );
    let pre = this.nodes.map((n) =>
      n === startVertex ? [n, "none"] : [n, null]
    );

    let taglist = [...this.nodes];
    while (taglist.length > 0) {
      let distanceTag = distance.filter((e) => taglist.includes(e[0]));
      distanceTag.sort((a, b) => {
        return a[1] - b[1];
      });
      let currentVertex = distanceTag[0];
      console.log(
        "the current Vertex:",
        currentVertex[0].nodeName,
        "d:",
        currentVertex[1]
      );
      let filterededges = [];
      if (this.representation === "edgelist") {
        filterededges = this.edges.filter(
          (e) =>
            (e.a === currentVertex[0] && taglist.includes(e.b)) ||
            (e.b === currentVertex[0] && taglist.includes(e.a))
        );
        console.log(
          "Filteredges:",
          filterededges.map((e) => e.a.nodeName + "-" + e.b.nodeName).join(", ")
        );
      } else if (this.representation == "neighborlist") {
        let neighborsUnknown = this.nodes.filter((n) => {
          console.log(
            "nodename:",
            n.nodeName,
            taglist.includes(n),
            n.neighbors.length,
            n.neighbors.filter((nn) => nn.oppositeNode == currentVertex[0])
              .length
          );
          return (
            n.neighbors.filter((nn) => nn.oppositeNode == currentVertex[0])
              .length > 0 && taglist.includes(n)
          );
        });
        //combine neighbors(known & unknown )
        console.log(neighborsUnknown);
        for (let n of neighborsUnknown) {
          console.log("NachbarnU:", n);
          filterededges.push(
            new Base.Edge(
              currentVertex[0],
              n,
              n.neighbors.find(
                (ne) => ne.oppositeNode === currentVertex[0]
              ).weight
            )
          );
        }
        let neighborsKnown = currentVertex[0].neighbors.filter((n) =>
          taglist.includes(n.oppositeNode)
        );

        for (let n of neighborsKnown) {
          console.log("NachbarnK:", n);
          filterededges.push(
            new Base.Edge(currentVertex[0], n.oppositeNode, n.weight)
          );
        }
      }
      for (let x of filterededges) {
        console.log("x is", x.a.nodeName + "-" + x.b.nodeName);

        // handle negative weights
        if (x.weight < 0) {
          console.log(
            `the weight is ${x.weight} is negative and therefore not supported`
          );
          return false;
        }
        let nodedistance = distance.find((e) =>
          x.a === currentVertex[0] ? e[0] === x.b : e[0] === x.a
        );
        console.log(
          "  - distance to node :",
          nodedistance[0].nodeName,
          nodedistance[1]
        );
        console.log(
          "  - is it more than what we see here?:",
          currentVertex[1] + x.weight
        );
        if (currentVertex[1] + x.weight < nodedistance[1]) {
          nodedistance[1] = currentVertex[1] + x.weight;
          let preentry = pre.find((e) => e[0] === nodedistance[0]);
          preentry[1] = currentVertex[0];
          console.log(
            "  - we set pre of",
            preentry[0].nodeName,
            "to",
            preentry[1] !== "none" ? preentry[1].nodeName : "none"
          );
        }
      }

      // remove from taglist
      taglist.splice(taglist.indexOf(currentVertex[0]), 1);
    }
    /*
        1. loop in pre & skip entry 0
        2. grab the node
        3. switch to distance
        4.look for the entry of the node
        5. grab the weight
        6. add to the tree
        7. pre + node + weight
        8. repeat
        */

    console.log(
      "final check distances:",
      "\n" + distance.map((d) => d[0].nodeName + ": " + d[1]).join("\n")
    );
    let filteredpre = pre.filter((el) => el[1] != "none");
    console.log("prefiltered", filteredpre);
    for (let el of filteredpre) {
      let distanceToEl = distance.find((en) => en[0] === el[0]);
      let weight = distanceToEl[1];
      treeSSSP.add(el[1], el[0], weight);
    }
    treeSSSP.DOT();
    return treeSSSP;
  }

  //Private Methods - can not  be accessed on the instance Level

  ////-------------------Edgelistadd-------------------
  #edgelistadd(m, n, weight) {
    if (this.edgetype === "undirected") {
      for (let edge of this.edges) {
        if (edge.a === m && edge.b === n) {
          console.log(
            "Warning! This violates the first OCL constraint - Edge will not be added to the list"
          );
          console.log("HERE IS THE EDGE:A");
          console.log(edge.a);
          return edge;
        }
        if (edge.a === n && edge.b === m) {
          console.log(
            "Warning! This violates the second OCL constraint - Edge will not be added to the list"
          );
          return edge;
        }
      }
    } else if (this.edgetype === "directed") {
      for (let edge of this.edges) {
        if (edge.a === m && edge.b === n) {
          console.log(
            "Warning! This violates the first OCL constraint - Edge will not be added to the list"
          );
          console.log("directed:", edge);
          return edge;
        }
      }
    }
    return this.#addtolist(m, n, weight);
  }
  //-------------------Neighborlist add -------------------
  #neighborlistadd(m, n, weight) {
    if (this.edgetype === "undirected") {
      if (
        m.neighbors.find(
          (neighbor) =>
            neighbor.oppositeNode == n &&
            n.neighbors.find((neighbor) => neighbor.oppositeNode == m)
        )
      ) {
        console.log(
          `there is already a connection from node${m.nodeName} to node${n.nodeName}`
        );
        const existingNeighbor = m.neighbors.find(
          (neighbor) =>
            neighbor.oppositeNode == n &&
            n.neighbors.find((neighbor) => neighbor.oppositeNode == m)
        );
        return existingNeighbor;
      } else {
        m.neighbors.push(new Base.Neighbor(n, weight));
        n.neighbors.push(new Base.Neighbor(m, weight));
        return this.#addtolist(m, n, weight);
      }
    }
    if (this.edgetype === "directed") {
      if (m.neighbors.find((neighbor) => neighbor.oppositeNode == n)) {
        console.log(
          `there is already a connection between node${m.nodeName} and node${n.nodeName}`
        );
        const existingNeighbor = m.neighbors.find(
          (neighbor) => neighbor.oppositeNode == n
        );
        return existingNeighbor;
      } else {
        m.neighbors.push(new Base.Neighbor(n, weight));
        return this.#addtolist(m, n, weight);
      }
    }
  }

  #addtolist(m, n, weight) {
    if (this.representation === "edgelist") {
      let addedEdge = new Base.Edge(m, n, weight);
      this.edges.push(addedEdge);
    }
    this.nodes.includes(m)
      ? console.log("this node is already included")
      : this.nodes.push(m);
    this.nodes.includes(n)
      ? console.log("this node is already included")
      : this.nodes.push(n);
    return true;
  }

  //----------------------------------------- DOT METHODS -----------------------------------------
  //-------------------Undirected DOT Graphs-------------------
  #undirectedDOT() {
    let dotSyntax = "Graph { \n";
    dotSyntax += `node[label=""]; \n`;
    if (this.representation === "edgelist") {
      for (let nn of this.nodes.values()) {
        dotSyntax += nn.nodeName + "\n";
      }
      dotSyntax += `edge[label=""]\n`;
      for (let nodename of this.edges.values()) {
        if (this.weighted === true) {
          dotSyntax += `${nodename.a.nodeName}--${nodename.b.nodeName} [label=${nodename.weight}] \n`;
        } else {
          dotSyntax += `${nodename.a.nodeName}--${nodename.b.nodeName} \n`;
        }
      }
      dotSyntax += `}`;
      console.log(dotSyntax);
      return dotSyntax;
    } else if (this.representation === "neighborlist") {
      for (let nn of this.nodes.values()) {
        dotSyntax += nn.nodeName + "\n";
      }
      dotSyntax += `edge[label=""]\n`;
      let edgesarray = [];
      for (let nodes of this.nodes) {
        for (let neighbors of nodes.neighbors) {
          if (this.weighted === true) {
            if (
              edgesarray.includes(
                `${nodes.nodeName}--${neighbors.oppositeNode.nodeName} [label=${neighbors.weight}]`
              ) ||
              edgesarray.includes(
                `${neighbors.oppositeNode.nodeName}--${nodes.nodeName} [label=${neighbors.weight}]`
              )
            ) {
            } else {
              edgesarray.push(
                `${nodes.nodeName}--${neighbors.oppositeNode.nodeName} [label=${neighbors.weight}]`
              );
            }
          } else if (this.weighted === false) {
            if (
              edgesarray.includes(
                `${nodes.nodeName}--${neighbors.oppositeNode.nodeName}`
              ) ||
              edgesarray.includes(
                `${neighbors.oppositeNode.nodeName}--${nodes.nodeName}`
              )
            ) {
            } else {
              edgesarray.push(
                `${nodes.nodeName}--${neighbors.oppositeNode.nodeName}`
              );
            }
          }
        }
      }
      while (edgesarray.length > 0) {
        dotSyntax += edgesarray[0] + "\n";
        edgesarray.shift();
      }
      dotSyntax += `}`;

      console.log(dotSyntax);
      return dotSyntax;
    }
  }
  //-------------------directed DOT Graphs-------------------
  #directedDOT() {
    let dotSyntax = "Digraph { \n";
    dotSyntax += `node[label=""]; \n`;
    if (this.representation === "edgelist") {
      for (let nn of this.nodes.values()) {
        dotSyntax += nn.nodeName + "\n";
      }
      dotSyntax += `edge[label=""]\n`;
      for (let nodename of this.edges.values()) {
        if (this.weighted === true) {
          dotSyntax += `${nodename.a.nodeName}->${nodename.b.nodeName} [label=${nodename.weight}] \n`;
        } else {
          dotSyntax += `${nodename.a.nodeName}->${nodename.b.nodeName} \n`;
        }
      }
      dotSyntax += `}`;
      console.log(dotSyntax);
      return dotSyntax;
    }
    if (this.representation === "neighborlist") {
      for (let nn of this.nodes.values()) {
        dotSyntax += nn.nodeName + "\n";
      }
      dotSyntax += `edge[label=""]\n`;
      let edgesarray = [];
      for (let nodes of this.nodes) {
        for (let neighbors of nodes.neighbors) {
          if (this.weighted === true) {
            if (
              edgesarray.includes(
                `${nodes.nodeName}->${neighbors.oppositeNode.nodeName} [label=${neighbors.weight}]`
              )
            ) {
            } else {
              edgesarray.push(
                `${nodes.nodeName}->${neighbors.oppositeNode.nodeName} [label=${neighbors.weight}]`
              );
            }
          } else if (this.weighted === false) {
            if (
              edgesarray.includes(
                `${nodes.nodeName}->${neighbors.oppositeNode.nodeName}`
              )
            ) {
            } else {
              edgesarray.push(
                `${nodes.nodeName}->${neighbors.oppositeNode.nodeName}`
              );
            }
          }
        }
      }
      while (edgesarray.length > 0) {
        dotSyntax += edgesarray[0] + "\n";
        edgesarray.shift();
      }
      dotSyntax += `}`;

      console.log(dotSyntax);
      return dotSyntax;
    }
  }
};
Base.Edge = class Edge {
  constructor(a, b, weight) {
    this.a = a;
    this.b = b;
    this.weight = weight;
  }
};

Base.Node = class Node {
  constructor(nodeName) {
    this.nodeName = nodeName;
    this.neighbors = [];
  }
};

Base.Neighbor = class Neighbor {
  constructor(oppositeNode, weight) {
    this.oppositeNode = oppositeNode;
    this.weight = weight;
  }
};

test01 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "undirected"),
    (weighted = true),
    (dot = true),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01, 4);
  G_test.add(node00, node02, 2);
  G_test.add(node01, node03, 1);
  G_test.add(node01, node02, 6);
  G_test.add(node03, node04, 7);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01, 5);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00, 5);
  //no weight
  let var3 = G_test.add(node00, node05);
  //traversal test
  let var4 = G_test.SSSP(node00);
  //DOT
  let var5 = G_test.DOT();
  //DFS without Start
  let var6 = G_test.DFS();
  //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 !== true &&
    var3 == false &&
    var4 == false &&
    var5 == true &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT OF TEST 1:" + test01());

test02 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "directed"),
    (weighted = true),
    (dot = true),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01, 4);
  G_test.add(node00, node02, 2);
  G_test.add(node01, node03, 1);
  G_test.add(node01, node02, 6);
  G_test.add(node03, node04, 7);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01, 5);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00, 5);
  //no weight
  let var3 = G_test.add(node00, node05);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 == true &&
    var3 == false &&
    typeof var4 == "object" &&
    var5 === true &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT OF TEST 2:" + test02());

test03 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "directed"),
    (weighted = true),
    (dot = false),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01, 4);
  G_test.add(node00, node02, 2);
  G_test.add(node01, node03, 1);
  G_test.add(node01, node02, 6);
  G_test.add(node03, node04, 7);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01, 5);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00, 5);
  //no weight
  let var3 = G_test.add(node00, node05);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 == true &&
    var3 == false &&
    typeof var4 == "object" &&
    var5 === false &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 3:" + test03());

test04 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "undirected"),
    (weighted = true),
    (dot = false),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01, 4);
  G_test.add(node00, node02, 2);
  G_test.add(node01, node03, 1);
  G_test.add(node01, node02, 6);
  G_test.add(node03, node04, 7);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01, 5);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00, 5);
  //no weight
  let var3 = G_test.add(node00, node05);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 !== true &&
    var3 == false &&
    var4 == false &&
    var5 === false &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 4:" + test04());

test05 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "undirected"),
    (weighted = false),
    (dot = false),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01);
  G_test.add(node00, node02);
  G_test.add(node01, node03);
  G_test.add(node01, node02);
  G_test.add(node03, node04);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00);
  //with weight
  let var3 = G_test.add(node00, node05, 6);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 !== true &&
    var3 == false &&
    var4 == false &&
    var5 === false &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 5:" + test05());

test06 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "undirected"),
    (weighted = false),
    (dot = true),
    (traversal = false)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01);
  G_test.add(node00, node02);
  G_test.add(node01, node03);
  G_test.add(node01, node02);
  G_test.add(node03, node04);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00);
  //with weight
  let var3 = G_test.add(node00, node05, 6);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 !== true &&
    var3 == false &&
    var4 == false &&
    var5 == true &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 6:" + test06());

test07 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "directed"),
    (weighted = false),
    (dot = true),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01);
  G_test.add(node00, node02);
  G_test.add(node01, node03);
  G_test.add(node01, node02);
  G_test.add(node03, node04);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00);
  //with weight
  let var3 = G_test.add(node00, node05, 6);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 === true &&
    var3 == false &&
    var4 == false &&
    var5 == true &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 7:" + test07());

test08 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "directed"),
    (weighted = false),
    (dot = false),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01);
  G_test.add(node00, node02);
  G_test.add(node01, node03);
  G_test.add(node01, node02);
  G_test.add(node03, node04);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00);
  //with weight
  let var3 = G_test.add(node00, node05, 6);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 == true &&
    var3 == false &&
    var4 == false &&
    var5 == false &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 8:" + test08());

test09 = function () {
  G_test = new Base.Graph(
    (representation = "neighborlist"),
    (edgetype = "undirected"),
    (weighted = true),
    (dot = true),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01, 4);
  G_test.add(node00, node02, 2);
  G_test.add(node01, node03, 1);
  G_test.add(node01, node02, 6);
  G_test.add(node03, node04, 7);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01, 5);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00, 5);
  //no weight
  let var3 = G_test.add(node00, node05);
  //traversal test
  let var4 = G_test.SSSP(node00);
  //DOT
  let var5 = G_test.DOT();
  //DFS without Start
  let var6 = G_test.DFS();
  //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 !== true &&
    var3 == false &&
    var4 == false &&
    var5 == true &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT OF TEST 10:" + test09());

test10 = function () {
  G_test = new Base.Graph(
    (representation = "neighborlist"),
    (edgetype = "directed"),
    (weighted = true),
    (dot = true),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01, 4);
  G_test.add(node00, node02, 2);
  G_test.add(node01, node03, 1);
  G_test.add(node01, node02, 6);
  G_test.add(node03, node04, 7);

  // first OCL Constraint
  let var1 = G_test.add(node00, node01, 5);
  // second OCL Constraint
  let var2 = G_test.add(node01, node00, 5);
  // no weight
  let var3 = G_test.add(node00, node05);
  // //traversal test
  console.log("THIS.NODES BEFORE SSSP" + G_test.nodes);
  let var4 = G_test.SSSP(node00);
  console.log("THIS.NODES AFTER SSSP" + G_test.nodes);
  //DOT
  let var5 = G_test.DOT();
  //DFS without Start
  let var6 = G_test.DFS();
  //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 == true &&
    var3 == false &&
    typeof var4 == "object" &&
    var5 === true &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT OF TEST 11:" + test10());

test11 = function () {
  G_test = new Base.Graph(
    (representation = "neighborlist"),
    (edgetype = "directed"),
    (weighted = true),
    (dot = false),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01, 4);
  G_test.add(node00, node02, 2);
  G_test.add(node01, node03, 1);
  G_test.add(node01, node02, 6);
  G_test.add(node03, node04, 7);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01, 5);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00, 5);
  //no weight
  let var3 = G_test.add(node00, node05);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 == true &&
    var3 == false &&
    typeof var4 == "object" &&
    var5 === false &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 12:" + test11());

test12 = function () {
  G_test = new Base.Graph(
    (representation = "neighborlist"),
    (edgetype = "undirected"),
    (weighted = true),
    (dot = false),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01, 4);
  G_test.add(node00, node02, 2);
  G_test.add(node01, node03, 1);
  G_test.add(node01, node02, 6);
  G_test.add(node03, node04, 7);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01, 5);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00, 5);
  //no weight
  let var3 = G_test.add(node00, node05);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 !== true &&
    var3 == false &&
    var4 == false &&
    var5 === false &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 12:" + test12());

test13 = function () {
  G_test = new Base.Graph(
    (representation = "neighborlist"),
    (edgetype = "undirected"),
    (weighted = false),
    (dot = false),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01);
  G_test.add(node00, node02);
  G_test.add(node01, node03);
  G_test.add(node01, node02);
  G_test.add(node03, node04);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00);
  //with weight
  let var3 = G_test.add(node00, node05, 6);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 !== true &&
    var3 == false &&
    var4 == false &&
    var5 === false &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 13:" + test13());

test14 = function () {
  G_test = new Base.Graph(
    (representation = "edgelist"),
    (edgetype = "undirected"),
    (weighted = false),
    (dot = true),
    (traversal = false)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01);
  G_test.add(node00, node02);
  G_test.add(node01, node03);
  G_test.add(node01, node02);
  G_test.add(node03, node04);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00);
  //with weight
  let var3 = G_test.add(node00, node05, 6);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 !== true &&
    var3 == false &&
    var4 == false &&
    var5 == true &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 14:" + test14());

test15 = function () {
  G_test = new Base.Graph(
    (representation = "neighborlist"),
    (edgetype = "directed"),
    (weighted = false),
    (dot = true),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01);
  G_test.add(node00, node02);
  G_test.add(node01, node03);
  G_test.add(node01, node02);
  G_test.add(node03, node04);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00);
  //with weight
  let var3 = G_test.add(node00, node05, 6);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 === true &&
    var3 == false &&
    var4 == false &&
    var5 == true &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 15:" + test15());

test16 = function () {
  G_test = new Base.Graph(
    (representation = "neighborlist"),
    (edgetype = "directed"),
    (weighted = false),
    (dot = false),
    (traversal = true)
  );
  node00 = new Base.Node(0);
  node01 = new Base.Node(1);
  node02 = new Base.Node(2);
  node03 = new Base.Node(3);
  node04 = new Base.Node(4);
  node05 = new Base.Node(5);
  //working ADDs
  G_test.add(node00, node01);
  G_test.add(node00, node02);
  G_test.add(node01, node03);
  G_test.add(node01, node02);
  G_test.add(node03, node04);
  //first OCL Constraint
  let var1 = G_test.add(node00, node01);
  //second OCL Constraint
  let var2 = G_test.add(node01, node00);
  //with weight
  let var3 = G_test.add(node00, node05, 6);
  // //traversal test
  let var4 = G_test.SSSP(node00);
  // //DOT
  let var5 = G_test.DOT();
  // //DFS without Start
  let var6 = G_test.DFS();
  // //DFS with Start
  let var7 = G_test.DFS(node01);
  return (
    var1 !== true &&
    var2 == true &&
    var3 == false &&
    var4 == false &&
    var5 == false &&
    typeof var6 === "object" &&
    typeof var7 === "object"
  );
};
console.log("HERE IS THE TEST RESULT of Test 16:" + test16());

/*
 * ---------------%<------------------
 * End of my implementation
 */

Base.Test = Base.Test || {}; /* declare 'Base.Test' namespace */

Base.Test = {
  /* Acceptance tests */
  test1: assertEq(
    typeof Base.Graph === "function",
    true,
    "Graph class does not exist"
  ),
  test2: assertEq(
    typeof Base.Edge === "function",
    true,
    "Edge class does not exist"
  ),
  test3: assertEq(
    typeof Base.Node === "function",
    true,
    "Node class does not exist"
  ),
  test4: assertEq(
    typeof Base.Graph.prototype.add === "function",
    true,
    "Method 'add' for Graph does not exist"
  ),
  /*
   * Begin of my tests
   * (Pls. only use assertEq(v1, v2[, message]))
   * ---------------%<------------------
   */
  /* (Pls. enter your additional tests here.) */

  test5: assertEq(
    test01() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test6: assertEq(
    test02() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test7: assertEq(
    test03() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test8: assertEq(
    test04() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test9: assertEq(
    test05() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test10: assertEq(
    test06() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test11: assertEq(
    test07() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test12: assertEq(
    test08() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test13: assertEq(
    test09() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test14: assertEq(
    test10() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test15: assertEq(
    test11() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test16: assertEq(
    test12() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test17: assertEq(
    test13() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test18: assertEq(
    test14() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test19: assertEq(
    test15() === true,
    true,
    "The expected result should be true - please check your config"
  ),
  test20: assertEq(
    test16() === true,
    true,
    "The expected result should be true - please check your config"
  ),

  /* ---------------%<------------------
   * End of my tests
   */
};

delete Base.Test;
