define(['jquery','backbone','underscore','backbone.validation','jquery.serializeObject'],function($,Backbone,_){
	return Backbone.View.extend({
		events:{
			'click #btn-create':'validate'
		},
		initialize: function(opts){
			this.model = opts.model;
			this.bindValidation();
		},
		validate: function(e){
			var data = this.$el.serializeObject();
			this.model.set(data);
			if(this.model.isValid(true)){
				this.submit();
			}
		},
		bindValidation: function(){
			Backbone.Validation.bind(this,{
				valid: this.onValid,
				invalid: this.onInvalid
			});
		},
		onValid: function(v,attr){
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-error').addClass('has-success');
			$(input).parent().find('.alert').remove();
		},
		onInvalid: function(v,attr,error){
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-success').addClass('has-error').append('<div class="alert alert-danger>' + error + '</div>');
		},
		submit:function(){
			this.$el.submit();
		}
	});
});