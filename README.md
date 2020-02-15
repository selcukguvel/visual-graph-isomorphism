# Visual Graph Isomorphism

A program that shows graph isomorphism visually by adjusting the position of nodes according to the mapping obtained through **`NetworkX`** library. In order to display the graphs and adjusting their nodes, **`D3.js`** library is used.

## Downloading & Running

### Download Repository

```bash 
git clone https://github.com/selcukguvel/visual-graph-isomorphism
```

### Install Required Libraries

```bash  
cd visual-graph-isomorphism
pip install -r requirements.txt
```

### Run Program (Python3 is prerequisite)

```bash   
python service/graph_matcher.py
```
```bash   
Open index.html
```

## Graph File Format

In graph file, each line contains space separated (whitespace, tab etc.) ids of two nodes:
```
node_1   node_2
node_1   node_4
node_2   node_3
node_3   node_4
...
```
where `node_i` is the id of the node as a number.

