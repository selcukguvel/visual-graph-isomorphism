import csv
import io
import sys
import os

from datetime import datetime

from flask import Flask
from flask import request
from flask_cors import CORS

import networkx as nx
from networkx.readwrite import json_graph
from networkx.algorithms import isomorphism


app = Flask(__name__)
CORS(app)

first_graph = nx.Graph()
second_graph = nx.Graph()
mapping_between_graphs = {}


@app.route('/parse', methods=['POST'])
def parse_graph():
    print('Parsing the graph..', file=sys.stdout)
    graph_file = request.files['file'].read()
    graph = parse(graph_file)
    save_graph_to_memory(graph, request.form['graphOrder'])
    response = get_parsed_graph_response_json(graph)
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


def save_graph_to_memory(graph, graphOrder):
    global first_graph
    global second_graph

    if (graphOrder == "1"):
        first_graph = graph
    elif (graphOrder == "2"):
        second_graph = graph


def get_parsed_graph_response_json(graph):
    response = {}
    if (graph == None):
        response['error'] = 'Unsupported file format.'
    else:
        graph_json = json_graph.node_link_data(graph)
        response['nodes'] = graph_json['nodes']
        response['links'] = graph_json['links']
        response['numOfNodes'] = graph.number_of_nodes()
        response['numOfEdges'] = graph.number_of_edges()
    return response


@app.route('/isomorphism', methods=['GET'])
def check_isomorphism_between_graphs():
    print('Checking isomorphism between graphs..', file=sys.stdout)
    response = get_isomorphism_result_response_json()
    return response


def get_isomorphism_result_response_json():
    global mapping_between_graphs
    response = {}
    if (nx.faster_could_be_isomorphic(first_graph, second_graph)):
        graph_matcher = isomorphism.GraphMatcher(first_graph, second_graph)
        if (graph_matcher.is_isomorphic()):
            response['isIsomorphic'] = True
            response['mapping'] = graph_matcher.mapping
            mapping_between_graphs = graph_matcher.mapping
    else:
        response['isIsomorphic'] = False
    return response


@app.route('/save-result', methods=['GET'])
def save_isomorphism_result():
    print('Will save isomorphism result between graphs..', file=sys.stdout)
    response = get_mapping_file_response_json()
    return response


def get_mapping_file_response_json():
    response = {}
    try:
        file_name = create_mapping_file()
        response['fileName'] = file_name
        response['fileCreatedSuccess'] = True
    except BaseException as err:
        print(err, file=sys.stdout)
        response['fileCreatedSuccess'] = False

    return response


def create_mapping_file():
    if (not os.path.exists("mappings")):
        os.mkdir("mappings")

    now = datetime.now()
    date_time = now.strftime("%d%b%Y-%H.%M.%S")
    file_name = "mappings/" + date_time + ".txt"
    f = open(file_name, "w")

    mapping_keys = mapping_between_graphs.keys()
    for i, key in enumerate(mapping_keys):
        f.write(key + '\t' + mapping_between_graphs[key])
        if (i != len(mapping_keys)-1):
            f.write('\n')

    return file_name


if __name__ == '__main__':
    app.run(debug=True)
