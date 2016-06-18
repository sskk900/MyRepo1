'use strict';

/* Services */

var app = angular.module('configuratorApp');
app
.factory(
		'ProjectService',
		[
				'$http',
				'ReadConfigurationService',
				'$q',
				'$rootScope',
				'$state',
				'$filter','SpinnerService','DSCacheFactory',
				function($http, ReadConfigurationService, $q,
						$rootScope, $state, $filter,SpinnerService,DSCacheFactory) {
				
					
					
					
					return {
						getProjects : function(id){
							 var deferred = $q.defer();
					    	 var url=ReadConfigurationService.getURL() +"/cxf/project/"+id;
					    	 $http
								.get(url)
								.success(function(data) {
									deferred.resolve({
										dataFromService : data,
									});
								})
								 return deferred.promise;
						},
						
						saveProject : function(id){
							var deferred = $q.defer();
						   	
							var url=ReadConfigurationService.getURL() +"/cxf/project/"+id;	
						
			    		 $http.put(url, {
			    			 params: {"projectData": $rootScope.dataForTheTree}
			    			 
			    		 })    		 
			    		 .success(
										function(data) { 
											if(angular.isDefined(data.error)){
							        		 $rootScope.error.errorStatusCode="403";
							        		 $rootScope.error.errorMsg=data.error;
								    		   $state.go('error');
								    	   }else{
								    		   deferred.resolve({
										        	  dataFromService: data,
										            }); 
								    	  }
									       });
			    	 return deferred.promise;	
							
							
						},
						
						search : function(context,serviceName,searchParam){
						   	 var deferred = $q.defer();
						   	
						   	 var url=ReadConfigurationService.getURL() + "/cxf/artifact";
						   	 var searchParamModified=({
								"criteria" : searchParam,									
								"artifactType" :"proddef",
							});
						    	
						   	 $http.get(url, {
						    	    params: { "combinedcriteria": searchParamModified}
						   	}).success(
											function(data) { 
										          if(angular.isDefined(data.error)){
							        		 $rootScope.error.errorStatusCode="403";
							        		 $rootScope.error.errorMsg=data.error;
							        		 //$state.go('error');
							        		 $rootScope.includeErrorPage=true;
											 SpinnerService.stopSpin();
											 $state.go(context);
								    	   }else{
								    		   deferred.resolve({
										        	  dataFromService: data,
										            }); 
								       		}
										       }).error(function (data, status) {
												if(data.error){
													$rootScope.error.errorMsg=data.error;	
												}else{
													$rootScope.error.errorMsg="Service Unavailable";
												}
												if(data.errorCode){
													$rootScope.error.errorStatusCode=data.errorCode;
												}else{
													if (status ===405 || status===403){
														$rootScope.error.errorStatusCode = status;
														$rootScope.error.errorMsg = "You are not authorize to perform this operation";
													}
													else
														$rootScope.error.errorStatusCode="404";
												}
												if($rootScope.error.errorStatusCode == "1001"){
													 deferred.resolve({
											        	  duplicateError: true,
											            });
												}
											});
						   	 return deferred.promise;
						   }
					}		
					}]).factory('ReadConfigurationService',['$location',
                        function($location) {
					return {
						getURL : function() {
							var url = $location.protocol() + "://"
									+ $location.host() + ":"
									+ $location.port();
							return url;
							
							
							
						}
					};
				} ]);
