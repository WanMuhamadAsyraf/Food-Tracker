get '/' do
  @sunday_food = List.find_by(list_name: "Sunday").foods
  @monday_food = List.find_by(list_name: "Monday").foods
  @tuesday_food = List.find_by(list_name: "Tuesday").foods
  @wednesday_food = List.find_by(list_name: "Wednesday").foods
  @thursday_food = List.find_by(list_name: "Thursday").foods
  @friday_food = List.find_by(list_name: "Friday").foods
  @saturday_food = List.find_by(list_name: "Saturday").foods

  @sunday_count = @sunday_food.empty? ? 0 : @sunday_food.map {|food| food.calories}.reduce(:+)
  @monday_count = @monday_food.empty? ? 0 : @monday_food.map {|food| food.calories}.reduce(:+)
  @tuesday_count = @tuesday_food.empty? ? 0 : @tuesday_food.map {|food| food.calories}.reduce(:+)
  @wednesday_count = @wednesday_food.empty? ? 0 : @wednesday_food.map {|food| food.calories}.reduce(:+)
  @thursday_count = @thursday_food.empty? ? 0 : @thursday_food.map {|food| food.calories}.reduce(:+)
  @friday_count = @friday_food.empty? ? 0 : @friday_food.map {|food| food.calories}.reduce(:+)
  @saturday_count = @saturday_food.empty? ? 0 : @saturday_food.map {|food| food.calories}.reduce(:+)

  erb :index
end

post '/add_food' do
  content_type :json

  @food = FatSecret.search_food(params[:food])
  @food_id = @food["foods"]["food"].first["food_id"]
  @find_result = FatSecret.food(@food_id)
  food_name = params[:food]
  calories =  @find_result["food"]["servings"]["serving"].first["calories"]
  day = List.find_by(list_name: params[:day])
  food = day.foods.create!(food_name: food_name, calories: calories)
  {food_name: food_name, calories: calories, day: day.list_name, food_id: food.id}.to_json
end

delete '/add_food/:id' do
  food = Food.find(params[:id])
  calories = food.calories
  day = food.list.list_name 
  food.destroy
  {id: food.id, day: day, calories: calories}.to_json
end 

delete '/delete_all_food' do
  Food.delete_all
  redirect '/' 
end 
