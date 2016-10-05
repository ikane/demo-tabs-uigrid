var app = angular.module('app', ['ui.grid','ui.grid.pagination']);

app.controller('MainController', MainController);

function MainController($scope, $http, $interval, uiGridConstants) {
	var paginationOptions = {
            pageNumber: 1,
            pageSize: 5,
        sort: null
        };
	
	// Indicates if a tab is active
	// Needed for proper rendering of grid inside a tab
	$scope.setTab = function(flag){
		$scope[flag] = true;

		// When 'news'-tab is clicked
		if(flag === 'news'){
			// Initialize 'useful'-subview
			$scope.subView = 'usefulNews';
		}
		
		// call resize every 200 ms for 2 s after modal finishes opening - usually only necessary on a bootstrap modal
		$interval( function() {
				console.log('in');
				if (flag === 'messages') {
					$scope.grid1Api.core.handleWindowResize();
				} else {
					$scope.grid2Api.core.handleWindowResize();
				}
			}, 10, 500);
	};
	
	$scope.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'name' },
		      { field: 'gender' },
		      { field: 'company', enableSorting: false }
		    ],
		    onRegisterApi: function( gridApi ) {
		      $scope.grid1Api = gridApi;
		      
		      // call resize every 500 ms for 5 s after modal finishes opening - usually only necessary on a bootstrap modal
		      $interval( function() {
		        $scope.grid1Api.core.handleWindowResize();
		      }, 500, 10);
		    }
		  };
	
	$scope.gridOptions2 = {
		    enableSorting: true,
		    onRegisterApi: function( gridApi ) {
		      $scope.grid2Api = gridApi;
		      
		      // call resize every 500 ms for 5 s after modal finishes opening - usually only necessary on a bootstrap modal
		      $interval( function() {
		        $scope.grid2Api.core.handleWindowResize();
		      }, 500, 10);
		    },
		    columnDefs: [
		      {
		        field: 'name',
		        sort: {
		          direction: uiGridConstants.DESC,
		          priority: 1
		        }
		      },
		      {
		        field: 'gender',
		        sort: {
		          direction: uiGridConstants.ASC,
		          priority: 0,
		        },
		        suppressRemoveSort: true,
		        sortingAlgorithm: function(a, b, rowA, rowB, direction) {
		          var nulls = $scope.grid2Api.core.sortHandleNulls(a, b);
		          if( nulls !== null ) {
		            return nulls;
		          } else {
		            if( a === b ) {
		              return 0;
		            }
		            if( a === 'male' ) {
		              return 1;
		            }
		            if( b === 'male' ) {
		              return -1;
		            }
		            if( a == 'female' ) {
		              return 1;
		            }
		            if( b === 'female' ) {
		              return -1;
		            }
		            return 0;
		          }
		        }
		      },
		      { field: 'company', enableSorting: false  }
		    ]
		  };
	
	$http.get('/data/sample.json')
    .success(function(data) {
      $scope.gridOptions1.data = data;
      //$scope.gridOptions2.data = data;
    });
	$http.get('/data/sample2.json')
    .success(function(data) {
      //$scope.gridOptions1.data = data;
      $scope.gridOptions2.data = data;
    });
}

/*
app.controller('StudentCtrl', ['$scope','StudentService', 
                               function ($scope, StudentService) {
                                   var paginationOptions = {
                                       pageNumber: 1,
                                       pageSize: 5,
                                   sort: null
                                   };
                            
                               StudentService.getStudents(
                                 paginationOptions.pageNumber,
                                 paginationOptions.pageSize).success(function(data){
                                   $scope.gridOptions.data = data.content;
                                   $scope.gridOptions.totalItems = data.totalElements;
                                 });
                            
                               $scope.gridOptions = {
                                   paginationPageSizes: [5, 10, 20],
                                   paginationPageSize: paginationOptions.pageSize,
                                   enableColumnMenus:false,
                                   useExternalPagination: true,
                                   columnDefs: [
                                      { name: 'id' },
                                      { name: 'name' },
                                      { name: 'gender' },
                                      { name: 'age' }
                                   ],
                                   onRegisterApi: function(gridApi) {
                                      $scope.gridApi = gridApi;
                                      gridApi.pagination.on.paginationChanged(
                                        $scope, 
                                        function (newPage, pageSize) {
                                          paginationOptions.pageNumber = newPage;
                                          paginationOptions.pageSize = pageSize;
                                          StudentService.getStudents(newPage,pageSize)
                                            .success(function(data){
                                              $scope.gridOptions.data = data.content;
                                              $scope.gridOptions.totalItems = data.totalElements;
                                            });
                                       });
                                   }
                               };
                           }]);

app.service('StudentService',['$http', function ($http) {
	 
    function getStudents(pageNumber,size) {
        pageNumber = pageNumber > 0?pageNumber - 1:0;
        return $http({
          method: 'GET',
            url: 'student/get?page='+pageNumber+'&size='+size
        });
    }
    return {
        getStudents: getStudents
    };
}]);
*/