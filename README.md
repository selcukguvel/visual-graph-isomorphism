# Visual Graph Isomorphism

![visual-graph-isomorphism](https://user-images.githubusercontent.com/22414712/74593626-370cc680-503e-11ea-9d7f-36b58eda8e04.gif)

A program that shows graph isomorphism visually by adjusting the position of nodes according to the mapping obtained through **`NetworkX`** library. In order to display the graphs and adjusting their nodes, **`D3.js`** library is used.

## Downloading & Running

### Download Repository

```bash
git clone https://github.com/selcukguvel/visual-graph-isomorphism
```

### Create a virtual environment and activate it

https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/

### Install dependencies

```bash
pip3 install -r requirements.txt
```

### Run Program

```bash
python3 service/graph_matcher.py
```

```bash
Open index.html
```

## Graph File Format

In an undirected graph file, each line contains space separated ids of two nodes:

```
node_1   node_2
node_1   node_4
node_2   node_3
node_3   node_4
...
```

where `node_i` is the id of the node as a number. The order of vertices in the file is trivial.

## Steps & Approach

- Run program.
- Upload two graphs to display them in the left and the right of the page.
- Click **Check Isomorphism** button.
  - Left graph will be adjusted according to the mapping (although there may be multiple mappings between the graphs, the one that **NetworkX** library returns is considered).
  - The positions of the nodes are adjusted with respect to distances between their initial positions and the mapped nodes' positions, using the Euclidean distance, in increasing order.
- Click to one of the nodes in left or right graph to highlight the id mapping row between these nodes in the table.
- Click **Save** button in order to save the mapping between two graphs as a file to the **mapping** directory.
- Adjust the right graph as you want and click again **Check Isomorphism** button to adjust the left graph to final node positions displayed in the right graph.
- Upload new graphs and check isomorphism as many as you want.
