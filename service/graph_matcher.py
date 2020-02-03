import csv
import io
import sys

from flask import Flask
from flask import request
from flask_cors import CORS

import networkx as nx
from networkx.readwrite import json_graph
from networkx.algorithms import isomorphism


app = Flask(__name__)
CORS(app)

firstGraph = nx.Graph()
secondGraph = nx.Graph()


@app.route('/parse', methods=['POST'])
def parse_graph():
    print('Parsing the graph..', file=sys.stdout)
    graph_file = request.files['file'].read()
    graph = parse(graph_file)
    saveGraphToMemory(graph, request.form['graphOrder'])
    response = getParsedGraphResponseJSON(graph)
    return response


def parse(byte_graph_file):
    try:
        graph_file_rows = byte_graph_file.decode().split('\n')
        graph = nx.Graph()

        for line in graph_file_rows:
            splitted_line = line.rstrip().split()
            graph.add_edge(splitted_line[0], splitted_line[1])

        return graph
    except:
        return None


def saveGraphToMemory(graph, graphOrder):
    global firstGraph
    global secondGraph

    if (graphOrder == "1"):
        firstGraph = graph
    elif (graphOrder == "2"):
        secondGraph = graph


def getParsedGraphResponseJSON(graph):
    response = {}
    if (graph == None):
        response['error'] = 'Unsupported file format.'
    else:
        graphJSON = json_graph.node_link_data(graph)
        response['nodes'] = graphJSON['nodes']
        response['links'] = graphJSON['links']
        response['numOfNodes'] = graph.number_of_nodes()
        response['numOfEdges'] = graph.number_of_edges()
    return response


@app.route('/isomorphism', methods=['GET'])
def check_isomorphism_between_graphs():
    print('Checking isomorphism between graphs..', file=sys.stdout)
    response = getIsomorphismResultResponseJSON()
    return response


def getIsomorphismResultResponseJSON():
    response = {}
    if (nx.faster_could_be_isomorphic(firstGraph, secondGraph)):
        graph_matcher = isomorphism.GraphMatcher(firstGraph, secondGraph)
        if (graph_matcher.is_isomorphic()):
            response['isIsomorphic'] = True
            response['mapping'] = graph_matcher.mapping
    else:
        response['isIsomorphic'] = False
    return response


if __name__ == '__main__':
    app.run(debug=True)
