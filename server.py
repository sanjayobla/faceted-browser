from bson.json_util import dumps
import json
from collections import Counter

from pymongo import MongoClient
client = MongoClient()
winedb = client.winedb
wine = winedb.wine
descriptorwine = winedb.descriptorwine

from flask import Flask, jsonify, render_template, request
app = Flask(__name__)
 
@app.route('/')
def index():
    return render_template('index.html')
 
@app.route('/echo/', methods=['GET'])
def echo():
    ret_data = {"value": request.args.get('echoValue')}
    return jsonify(ret_data)

@app.route('/filter/', methods=['GET'])
def filter():
	filters = {}
	inputs = request.args
	for input in inputs:
		filters[input] = inputs[input]
	category = filters['category']
	pipeline = []
	match = {}
	match['$match'] = {}
	for filter in filters:
		if filter != 'category':
			match['$match'][filter] = filters[filter]
	pipeline.append(match)
	pipeline.append({'$group': { '_id': '$'+str(category), 'average': { '$avg': '$Rating'}, 'count': { '$sum': 1 }}})
	pipeline.append({'$sort': { 'count': -1 }})
	print pipeline

	records = wine.aggregate(pipeline, cursor={})

	return_obj = {}
	total_records = max_count = max_avg = 0
	return_obj['rows'] = json.loads(dumps(records))
	print return_obj
	desc_count_array = []
	for record in return_obj['rows']:
		desc_pipeline = []
		total_records += record['count']
		max_count = max(max_count,record['count'])
		max_avg = max(max_avg,record['average'])
		match['$match'][category] = record['_id']
		desc_pipeline.append(match)
		desc_pipeline.append({'$project': { '_id':0, 'Descriptor':1}})
		desc_records = wine.aggregate(desc_pipeline, cursor={})
		desc_count = Counter()
		for desc_record in desc_records:
			descriptors = desc_record['Descriptor'].split(',')
			for descriptor in descriptors:
				desc_count[descriptor] += 1
		desc_count_array.append(desc_count.most_common())
	
	return_obj['Descriptors'] = desc_count_array
	return_obj['total_records'] = total_records
	return_obj['max_count'] = max_count
	return_obj['max_avg'] = max_avg

	return_json = json.dumps(return_obj)
	print return_json
	return return_json

@app.route('/populateFilters/', methods=['GET'])
def populateFilters():
	ret_data = {}
	return_obj = {}
	record = wine.find_one()
	for key in record.keys():
		if key not in ['Descriptor','docText','WineN','CombinedLocation','LabelName','VinN','RatingShow','docID','_id','Rating','Producer','DrinkDate','DrinkDate_Hi','SourceDate','Issue','Pages']:
			ret_data[key] = wine.distinct(key)
	return_obj['filters'] = json.loads(dumps(ret_data))
	return_obj['categories'] = record.keys()
	return_json = json.dumps(return_obj)
	return return_json

if __name__ == '__main__':
    app.run(port=8080, debug=True)
