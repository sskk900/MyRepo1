'use strict';

/* Controllers */

var app = angular.module('configuratorApp');
app
.controller(
		'projectController',
		[
				
				'$scope',
				'$http',
				'$state',
				'$rootScope',
				'localize',
				'SpinnerService',
				'$location','$filter','ProjectService','ModalService',
				
				function($scope, $http, $state, $rootScope,localize,SpinnerService,$location,$filter,ProjectService,ModalService) {
					
					$rootScope.dataForTheTree=[];
					$rootScope.includeErrorPage=false;
					$scope.predicate="";
					var treeId="projects";
					$scope.controls = [];
					$scope.settingsTitle ="";
					$scope.selectedNode = {};
					$scope.treeOptions = {

						    nodeChildren: "Resource",
						    dirSelectable: true,
						    injectClasses: {
						        ul: "a1",
						        li: "a2",
						        liSelected: "a7",
						        iExpanded: "a3",
						        iCollapsed: "a4",
						        iLeaf: "a5",
						        label: "a6",
						        labelSelected: "a8"
						    }
						};

					$scope.initHeaderAction = function(screenID) {
						$rootScope.filterHeaderAction(screenID);
					};
				
					$scope.nodeSelected = function(node){
					}	
					$scope.loadTreeData = function(id) {
					SpinnerService.startSpin();
						var promise = ProjectService
						.getProjects(id);
					return promise.then(
								function(result) {
									$rootScope.serviceResult = result;
									$rootScope.dataForTheTree=[JSON.parse(JSON.stringify(result.dataFromService[0]))];
								SpinnerService.stopSpin();
								});
						};
					
						$scope.loadInitData = function(screenID) {
							$rootScope.filterHeaderAction(screenID);
						};
					
					
						$scope.showAddObjectList=function(){
							var planNameModal='policyProduct.planName';
							var planUuid = 'jcr:uuid';
							
							
							
							$scope.showNoObjMsg=true;
							//var flag1=false;
							$scope.addObjectList=[];
							//$scope.addObjectList.push("FirstResource");  
							var searchParam = [{resultProp:"policyProduct.planName", propValue:"jcr:uuid"}];
							var promise = ProjectService.search("plan",null,searchParam);
							promise.then(function(data){
							
								angular.forEach(data.dataFromService, function(item) {
									var res = {
											label:item[planNameModal],
											uuid:item[planUuid]
										};
									$scope.addObjectList.push(res);
								
							})
							});
							console.log(promise);
							return $scope.addObjectList;				 
					
						}
						
						
						$rootScope.addResourceToProject=function(){
							var arrayList=[];
							arrayList=$scope.showAddObjectList();
							ModalService.showModal({
							    templateUrl: "project/add.html",
							    controller: "AddResourceController",
							    inputs:{
						  			 item: arrayList,
						  			 message:$scope.showNoObjMsg
						  			 }
							  }).then(function(modal) {
						        modal.element.modal();
							    modal.close.then(function(result) { 
							      console.log(result);
							     // $scope.addtotree(result);
							    });
							  });
						};
						
						$rootScope.saveResourceToProject = function() {
                   		 SpinnerService.startSpin();
                   		 var id = $rootScope.projectId;
                   		 var promise = ProjectService.saveProject(id);
                   		 return promise.then(function(result) {
                   			 $rootScope.alert = result.dataFromService;
                   			 if (!$rootScope.alert.success) {
                   				 $scope.showErrorMsg = true;
                   			 } else {
                   				 $rootScope.showSuccessMsg = true;
                   			 }
                   			 SpinnerService.stopSpin();
                   		 });
                   	 }; 
						
						
						
						
						//$scope.addtotree= function(){
							//addt to tree
						//}
						
						/*$scope.showAddObjectList=function(){
							
							var a={
							        "data": "Click Here",
							        "size": 36,
							        "style": "bold",
							        "name": "text1",
							        "hOffset": 250,
							        "vOffset": 100,
							        "alignment": "center",
							        "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
							    }
							return a;
						};*/
				
				}]);




app.controller('AddResourceController', function($rootScope, $scope, $element, close,item,message) {
	$scope.addObjectList=item;
	$scope.showNoObjMsg=message;
	$scope.disableOKAdd=true;
	$scope.valueSelect=[];
	$scope.close = function() {
	 	  close();
	  };
	$scope.getSelectedObject= function(value){
			 $scope.valueSelect=value;
			 if($scope.valueSelect.length!='0'){
				 $scope.disableOKAdd=false;
			 }
		 };
   $scope.cancel = function() {
	   	$element.modal('hide');
		close();
	    $scope.removeBackDrop();		
			 };  
			
   $scope.removeBackDrop=function(){
		 var element =[];
		 element=document.getElementsByClassName("modal-backdrop fade in");
		 element[0].remove(); 			 
	  };
	$scope.closeDialog = function() {
		
		$rootScope.serviceResult.dataFromService[0].Resource.push($scope.valueSelect);
		$rootScope.dataForTheTree=[JSON.parse(JSON.stringify($scope.serviceResult.dataFromService[0]))];
		
	 	  close($scope.valueSelect);
	 	  $scope.removeBackDrop();
	  };
		 
});