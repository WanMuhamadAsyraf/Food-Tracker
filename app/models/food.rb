class Food < ActiveRecord::Base
   belongs_to :list
   validates :food_name, presence: true
 end
