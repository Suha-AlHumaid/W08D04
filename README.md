# W08D04
# Social Media Apis With Auths
It's social media backend project with authentication and authorization. It's includes signin and register system useing bcrybt and jwt. Give only permission for admin to delete or see users information and create custom role.

ّIndex:
* [Instructions](#Instructions)
* [Technologies](#technologies)
* [Schemas](#Schemas)
* [Routers](#Routers)

## Instructions for useing this project:
```
npm i  
 ```
create .env file and set your own values:
```
PORT=your own port
DB_URI= url on mongodb
SALT=salt value
secert_key=any secrt value
```

## Technologies:
* Mongoose
* Mongo DB
* express
* node js
* bcrybt
* jwt


## Entity Relationship Diagram
![entity relationship diagram](https://github.com/Suha-AlHumaid/W08D04/blob/main/img/digram.jpg)

## UML Diagram
![URM ](https://github.com/Suha-AlHumaid/W08D03/blob/main/img/uml.jpg)

## Schemas:
 * Role schema
    <br>  contains this information: role and permessions
 * user schema
   <br>  contains this information: email , password and role
 * post schema
    <br> contains this information: disciption , avatar, title, comments
* like schema
    <br> contains this information: like and user and post relative 

 ## Routers:
### Role Routers

 * Create role api
      <br> To create new user role like: admin and user.
      only admin can create a role
      
 * Get all role api
      <br> List all roles in the DB like: Admin and user.
      only admin can see rools

        
 ### User Routers
   * Register api
   * Login api
   * Delete user api
   * Soft delete user api
   * Get all users api

          
          
 ### Posts Routers 
   * Create new post api.
   * Update post api.
   * Delete post api.
   * Get all posts api.
   * Get post by id api.

 ### Comments Routers
   * Get all comments api
   * Get comment by id api
   * Add new comment api
   * Delete comment by id api 
   * Update comment by id api 
   * Delete any comment or post api  (for Admin only)
   * Delete any comment on user's post api (can delete others comments on his post)

          
          
 ### like Router 
   * Toggele like api.


   
