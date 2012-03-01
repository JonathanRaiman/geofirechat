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
	@@data.each { |receptiontime, value| receptiontime="5"} 
  content_type :json
  @@data.to_json
end

post '/messages' do
  content_type :json
  time = Time.new
  
  @locationIP = request.ip
  jsonresponse = JSON.parse(Net::HTTP.get_response(URI.parse("http://api.ipinfodb.com/v3/ip-city/?key=fcf5c6d5f16bd594c40883ac6161f788ac985f3d674ffee79667dbeac5a087c8&ip="+@locationIP+"&format=json")).body)
  message = JSON.parse(request.body.read.to_s).merge(:id => @@count +=1, :receptiontime => Time.now, :displayed_time => relative_time(Time.now),:user_ip => request.ip, :cityname => (jsonresponse['cityName']).split(" ").each{|word| word.capitalize!}.join(" "), :countryname => (jsonresponse['countryName']).split(" ").each{|word| word.capitalize!}.join(" "), :latitude => jsonresponse['latitude'], :longitude => jsonresponse['longitude'])
  @@data << message
  message.to_json
end

def relative_time(start_time)
  diff_seconds = Time.now - start_time
  case diff_seconds
    when 0 .. 59
      puts "#{diff_seconds} seconds ago"
    when 60 .. (3600-1)
      puts "#{diff_seconds/60} minutes ago"
    when 3600 .. (3600*24-1)
      puts "#{diff_seconds/360} hours ago"
    when (3600*24) .. (3600*24*7-1) 
      puts "#{diff_seconds/(3600*24)} days ago"
    when (3600*24*7) .. (3600*24*30)
      puts "#{diff_seconds/(3600*24*7)} weeks ago"
    else
      puts start_time.strftime("%m/%d/%Y")
  end
end
