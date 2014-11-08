set :application, "app-name"
set :current_path, "#{application}/public"
set :prod_path, "prod.example.com"
set :prod_app, "#{prod_path}"
set :prod_static_path, "/path/to/static.#{prod_app}"

default_run_options[:pty] = true

set :scm, :git

role :web, "#{prod_path}"    # Your HTTP server, Apache/etc
role :app, "#{prod_path}"       # This may be the same as your `Web` server

namespace :deploy do
  
  set(:user) do
    Capistrano::CLI.ui.ask("Enter user: ")
  end
  
  set(:commit_msg) do
    Capistrano::CLI.ui.ask("Enter commit message, or default => ") {|q| 
      q.default = "General Updates on #{DateTime.now.strftime("%m/%d/%Y %H:%I:%S")}"
    }
  end
    
  desc "Default, runs update"
  task :default do
    update
  end
  
  desc "Default update run code, runs all of the tasks including restart"
  task :update do
    transaction do
      commit_code
      push_code
      update_code
    end
  end
  
  desc "Continue deploy if an error occurred, or deploy was aborted after the commit"
  task :continue do
    push_code
    update_code
  end
  
  desc "Commit the code"
  task :commit_code do
    run_locally "git status"
    run_locally "git add ."
    run_locally "git commit -m '#{commit_msg}'"
  end
  
  desc "Push the code"
  task :push_code, :except => { :no_release => true } do
    run_locally "git push origin master"
  end

  desc "Update the code on the server"
  task :update_code, :roles => :web, :except => { :no_release => true } do
    run "cd #{current_path} && git reset --hard && git pull origin master"
  end

  [:start, :stop, :check, :setup, :create_symlink, :symlink, :cleanup, :cold, :migrate, :migrations].each do |t|
    task t do ; end
  end
  
  namespace :pending do
    [:default, :diff].each do |t|
      task t do ; end
    end
  end
end
