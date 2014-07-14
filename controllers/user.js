/* 
 * User Controller
 * @author: Rolilink
 */


// Save User Function Wrapped in a Promise
var saveUser = function(user){
	var deferred = q.defer();
	user.save(function(err){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(user);
	});
	return deferred.promise;
}

// List Paginated Users Function Wrapped in a Promise
var findUsers = function(query,attr,page,limit){
	var deferred = q.defer();
	console.log(page);
	console.log(limit);
	User.findPaginated(query,attr,page,limit).lean().exec(function(err,users){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(users);
	});
	return deferred.promise;
}

// Find User Function Wrapped in a Promise
var findUser = function(id,attr){
	var deferred = q.defer();
	User.findById(id,attr).exec(function(err,user){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(user);
	});
	return deferred.promise;
}

// Delete User Function Wrapped in a Promise
var deleteUser = function(user){
	var deferred = q.defer();
	user.remove(function(err,user){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(user);
	});
	return deferred.promise
}

// Seneca MicroServices

//works
seneca.add({controller:'user',action:'create'},function(args,cb){
	var data = _.omit(args.data,['role','emailKey','active','aId','profilePicture']),
	user = new User(data),
	profilePicture = args.file,
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){ cb(err,null); };

	saveUser(user).then(handleSuccess,handleError);
});

// check limit
seneca.add({controller:'user',action:'list'},function(args,cb){
	var page = args.page || 0,
	query = args.query || {},
	limit = args.limit || 10,
	handleSuccess = function(data){ cb(null,{users:data}); },
	handleError = function(err){ cb(err,null); };

	findUsers(query,'-password -emailKey -aId',page,limit).then(handleSuccess,handleError);
});

//works
seneca.add({controller:'user',action:'get'},function(args,cb){
	var id = args.id,
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){ cb(err,null); };
	
	findUser(id,'-password -emailKey -aId').then(handleSuccess,handleError);
});

//works
seneca.add({controller:'user',action:'delete'},function(args,cb){
	var id = args.id,
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){	cb(err,null); };

	findUser(id).then(deleteUser).then(handleSuccess,handleError);
});

//works
seneca.add({controller:'user',action:'update'},function(args,cb){
	var data = _.omit(args.data,['role','emailKey','active','aId','profilePicture']),
	id = args.id,
	profilePicture = args.file,
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){	cb(err,null); },
	updateUser = function(user){ return _.extend(user,data); };

	return findUser(id,'-password -emailKey -aId')
	.then(updateUser)
	.then(saveUser)
	.then(handleSuccess,handleError);
});

seneca.add({controller:'user',action:'editProfilePicture'},function(args,cb){
	var id = args.id,
	picture = args.picture,
	setPicture = function(user){ return user.setProfilePicture(picture); },
	handleSuccess = function(data){ cb(null,{picture:data}); },
	handleError = function(err){	cb(err,null); };
	findUser(id,'-password -emailKey -aId').then(setPicture).then(saveUser).then(handleSuccess,handleError);
});

