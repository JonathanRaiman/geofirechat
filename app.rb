require 'sinatra'
require 'json'
require 'net/http/persistent'
require 'rexml/document'
include REXML

@@data = []
@@count = 0
@locationIP = "chupacabra"

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/messages' do
  content_type :json
  @@data.to_json
end

post '/messages' do
  content_type :json
  apple = "hey"
  @locationIP = request.ip
  jsonresponse = JSON.parse(Net::HTTP.get_response(URI.parse("http://api.ipinfodb.com/v3/ip-city/?key=fcf5c6d5f16bd594c40883ac6161f788ac985f3d674ffee79667dbeac5a087c8&ip="+@locationIP+"&format=json")).body)
  message = JSON.parse(request.body.read.to_s).merge(:id => @@count +=1, :user_ip => request.ip, :cityname => jsonresponse['cityName'])
	#jsonresponse = Net::HTTP.get_response("http://api.ipinfodb.com/v3/ip-city/?key=fcf5c6d5f16bd594c40883ac6161f788ac985f3d674ffee79667dbeac5a087c8&ip="+ip+"&format=json")
  #unjsonedres = JSON.parse(jsonresponse)
  @@data << message
  message.to_json
end

def happyp (a)
	jsonresponse = Net::HTTP.get_response("http://api.ipinfodb.com/v3/ip-city/?key=fcf5c6d5f16bd594c40883ac6161f788ac985f3d674ffee79667dbeac5a087c8&ip="+a+"&format=json").body
	unjsonedres = JSON.parse(jsonresponse)
	unjsonedres puts ['cityName']
end