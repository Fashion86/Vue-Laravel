<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::group([
    'middleware' => 'api',
], function ($router) {
    Route::post('login', 'AuthController@login');
    Route::post('register', 'AuthController@registerUser');
    Route::post('project', 'ProjectController@addProject');
    Route::get('projects', 'ProjectController@getProjects');
    Route::get('users', 'AuthController@getUsers');
    Route::post('event', 'EventController@addEvent');
    Route::get('events', 'EventController@getEvents');
    Route::delete('events/{id}', 'EventController@deleteEvent');
    Route::put('event}', 'EventController@updateEvent');
//    Route::post('logout', 'AuthController@logout');
//    Route::post('refresh', 'AuthController@refresh');
//    Route::post('me', 'AuthController@me');
});
