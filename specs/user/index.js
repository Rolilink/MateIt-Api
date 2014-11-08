var utils = require('../utils'),
chai = require('chai'),
request = require('supertest-as-promised'),
eraseDb = require ('../utils').eraseDatabase,
UsersData = require('../utils').users;

describe("Users",function(){
	var baseUrl = "/api/users";
	describe("Create",function(){
		var data;
		before(function(done){
			this.timeout(3000);

			UsersData.create().then(function(rdata){
				data = rdata;
				done();
			})
			.catch(function(err){
				done(err);
			});
		});

		after(function(done){
			eraseDb()
			.then(function(){
				done();
			});
		});

		it("should have an User model available",function(){
			expect(User).not.to.be.undefined;
		});

		it("should respond 201 and return an user when doing a valid post to /api/users",function(done){
			var client = request(app);
			client
				.post(baseUrl)
				.send({user:{username:"newuser",email:"newuser@rolilink.com",password:'12345678'}})
				.expect(201)
				.then(function(res){
					var user = res.body.user;
					expect(user).not.to.be.undefined;
					expect(user).to.have.property('id');
					expect(user).to.have.property('email','newuser@rolilink.com');
					expect(user).to.have.property('username','newuser');
					expect(user).to.have.property('active',false);
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
		it("should respond 422 when missing required fields and return an array of errors",function(done){
			var client = request(app);
			client
				.post(baseUrl)
				.send({user:{username:"newuser"}})
				.expect(422)
				.then(function(res){
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property("password");
					expect(errors).to.have.property("email");
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond 422 when fields validate fails and return an array of errors",function(done){
			var client = request(app);
			client
				.post(baseUrl)
				.send({user:{username:"n",email:"newuser@rolilink.com",password:'12345678'}})
				.expect(422)
				.then(function(res){
					
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property("username");
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
	});	
});