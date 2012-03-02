require 'sinatra'
require 'json'
require 'net/http/persistent'
require 'rubygems'
require 'rexml/document'
require 'linguistics'
include REXML
Linguistics::use( :en )

@@data = []
@@count = 0
#{:latitude => 48.858391,:longitude => 2.341461, :receptiontime => "21:00:18", :content => "How's it going!",:cityname => "Paris", :countryname => "France"},{:latitude => 45.757942,:longitude => 4.822998, :content => "Yo!",:cityname => "Lyon", "countryname" => "France", :receptiontime => "23:42:00"}
get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/messages' do 
	for i in 0...@@data.length
       @@data[i][:displayedtime] = relative_time(@@data[i][:receptiontime])
    end
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

def pluralize(number, text)
  return text.en.plural if number != 1
  text
end

def relative_time(start_time)
  diff_seconds = Time.now.to_i - start_time.to_i
  case diff_seconds
    when 0 .. 59
       "Just now"
    when 60 .. (3600-1)
       "#{diff_seconds/60} "+pluralize((diff_seconds/60), 'minute')+" ago"
    when 3600 .. (3600*24-1)
       "#{diff_seconds/3600} "+pluralize((diff_seconds/3600), 'hour')+" ago"
    when (3600*24) .. (3600*24*7-1) 
       "#{diff_seconds/(3600*24)} "+pluralize((diff_seconds/(3600*24)), 'day')+" ago"
    when (3600*24*7) .. (3600*24*30)
       "#{diff_seconds/(3600*24*7)} "+pluralize((diff_seconds/(3600*24*7)), 'week')+" ago"
    else
       start_time.strftime("%m/%d/%Y")
  end
end
