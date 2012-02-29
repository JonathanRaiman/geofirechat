require 'sinatra'
require 'json'
require 'net/http/persistent'
require 'rexml/document'
include REXML

@@data = [{"latitude" => 48.858391,"longitude" => 2.341461, "receptiontime" => "21:00:18", "content" => "How's it going!","cityname" => "Paris", "countryname" => "France"},{"latitude" => 45.757942,"longitude" => 4.822998, "content" => "Yo!","cityname" => "Lyon", "countryname" => "France", "receptiontime" => "23:42:00"}]
@@count = 0

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/messages' do
  content_type :json
  @@data.to_json
end

post '/messages' do
  content_type :json
  time = Time.new
  
  @locationIP = request.ip
  jsonresponse = JSON.parse(Net::HTTP.get_response(URI.parse("http://api.ipinfodb.com/v3/ip-city/?key=fcf5c6d5f16bd594c40883ac6161f788ac985f3d674ffee79667dbeac5a087c8&ip="+@locationIP+"&format=json")).body)
  message = JSON.parse(request.body.read.to_s).merge(:id => @@count +=1, :receptiontime => time.strftime("%H:%M:%S"), :user_ip => request.ip, :cityname => (jsonresponse['cityName']).capitalize!, :countryname => (jsonresponse['countryName']).capitalize!, :latitude => jsonresponse['latitude'], :longitude => jsonresponse['longitude'])
  @@data << message
  message.to_json
end