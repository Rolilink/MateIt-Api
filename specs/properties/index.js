var utils = require('../utils'),
request = require('supertest-as-promised'),
eraseDb = require ('../utils').eraseDatabase,
PropertiesData = require('../utils').properties;

describe.only("Properties",function(){
	baseUrl = "/api/properties"
	describe("Create",function(){
		var data;

		before(function(done){
			this.timeout(3000);

			PropertiesData.create().then(function(rdata){
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

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should create a property when doing a valid post",function(done){
			var client = request.agent(app),
			adminClient = request.agent(app),
			prop,
			property = {
				capacity: 4,
				address: "Cerro Viento, Calle 62",
				country: "Panama",
				roomType: "private",
				propertyType: "house",
				title: "This is a Title",
				description: "asdasdasdasdas sadasdasdasdas asdasdasdasdasdasd asdasdas",
				genderAllowed: 'both',
				amenities: ['kitchen','internet','wifi'],
				price: 300,
				loc: [9.066006, -79.448069]
			};

			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl)
						.send({property:property})
						.expect(201);
				})
				.then(function(res){
					prop = res.body.property;
					
					expect(prop).not.to.be.undefined;
					expect(prop._id).not.to.be.undefined;
					expect(prop.owner).to.be.equals(data.users.user1.id);
					return adminClient
						.post('/login')
						.send({username:data.users.adminuser.username,password:"12345678"});
				})
				.then(function(){
					return adminClient
						.get('/api/users/' + data.users.user1.id)
				})
				.then(function(res){
					var response = res.body.user;
					expect(response).not.to.be.undefined;
					expect(response.property.data).to.be.equals(prop._id);
					expect(response.property.isOwner).to.be.equals(true);
					done();
				})
				.catch(done);
		});
		
		it("should respond with 401 when user is not authenticated",function(done){
			var client = request.agent(app),
			property = {
				capacity: 4,
				address: "Cerro Viento, Calle 62",
				country: "Panama",
				roomType: "private",
				propertyType: "house",
				title: "This is a Title",
				description: "asdasdasdasdas sadasdasdasdas asdasdasdasdasdasd asdasdas",
				genderAllowed: 'both',
				amenities: ['kitchen','internet','wifi'],
				price: 300,
				loc: [9.066006, -79.448069]
			};

			client
				.post(baseUrl)
				.send(property)
				.expect(401)
				.then(function(res){
					done();
				})
				.catch(done);
		});

		it("should respond with 422 and an errors object when missing required fields",function(done){
			var client = request.agent(app),
			property = {
				capacity: 4,
				address: "Cerro Viento, Calle 62",
				country: "Panama",
				roomType: "private",
				propertyType: "house",
				genderAllowed: 'both',
				amenities: ['kitchen','internet','wifi'],
				price: 300,
				loc: [9.066006, -79.448069]
			};

			client
				.post('/login')
				.send({username:data.users.user2.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl)
						.send({property:property})
						.expect(422);
				})
				.then(function(res){
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property("title");
					expect(errors).to.have.property("description");
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond with a 422 and an errors object containing a validation error per field when failing validation",function(done){
			var client = request.agent(app),
			property = {
				capacity: 0,
				address: "Cerro Viento, Calle 62",
				country: "Panama",
				roomType: "private",
				propertyType: "house",
				title: "This is a Title",
				description: "asdasdasdasdas sadasdasdasdas asdasdasdasdasdasd asdasdas",
				genderAllowed: 'none',
				amenities: ['kitchen','internet','wifi'],
				price: 300,
				loc: [9.066006, -79.448069]
			};

			client
				.post('/login')
				.send({username:data.users.user2.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl)
						.send({property:property})
						.expect(422);
				})
				.then(function(res){
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property("capacity");
					expect(errors).to.have.property("genderAllowed");
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond with a 422 and an error user cant create more properties",function(done){
			var client = request.agent(app),
			property = {
				capacity: 0,
				address: "Cerro Viento, Calle 62",
				country: "Panama",
				roomType: "private",
				propertyType: "house",
				title: "This is a Title",
				description: "asdasdasdasdas sadasdasdasdas asdasdasdasdasdasd asdasdas",
				genderAllowed: 'none',
				amenities: ['kitchen','internet','wifi'],
				price: 300,
				loc: [9.066006, -79.448069]
			};

			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl)
						.send({property:property})
						.expect(422);
				})
				.then(function(res){
					var error = res.body.error;
					expect(error).not.to.be.undefined;
					expect(error).to.be.equals("You already have a property created.");
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		//Finish create#describe()
	});

	describe("List",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should respond with a list of properties when doing a valid query");
		it("should respond with a 401 when user is not authenticated");

		// finish list#describe()
	});

	describe("Get",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should respond with the property when doing a valid get");
		it("should respond with 401 when user is not authenticated");
		it("should respond with 404 when property does not exist");
		it("should respond with 422 when giving a bad id");

		//finish get#describe()
	});

	describe("Update",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should update the property when doing a valid get");
		it("should respond with 404 when property does not exist");
		it("should respond with 422 when giving a bad id");
		it("should respond with a 422 and an errors object containing a validation error per field when failing validation");
		it("should respond with 401 when user is not property owner or is not admin");
		it("should respond with 401 when user is not authenticated");
		it("should respond with 404 when property does not exist");
		it("should respond with 422 when giving a bad id");

	});

	describe("Delete",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should delete a property when doing a sucessful delete request");
		it("should respond with 401 when user is not authenticated");
		it("should respond with 404 when property does not exist");
		it("should respond with 401 when user is not property owner or is not admin");
		it("should respond with 422 when giving a bad id");


		// finish delete#describe()
	})

// finish properties#describe()
});