class CreateFoodList < ActiveRecord::Migration
  def change
    create_table :foods do |t|
      t.references :list
      t.string :food_name
      t.integer :calories
      t.timestamps
    end
  end
end
