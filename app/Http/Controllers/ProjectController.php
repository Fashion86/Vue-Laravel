<?php

namespace App\Http\Controllers;

use App\Project;
use App\User;
use Illuminate\Http\Request;
use Validator;
use Response;

class ProjectController extends Controller
{
    public function addProject(Request $request) {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 500);
        }

        try {
            $project = Project::create([
                'name' => $request->get('name'),
                'user_id' => $request->get('user'),
            ]);
//            $user = User::find($request->get('user'));
//            $user->projects()->save($project);
            return Response::json(['success' => 'Project is Successfully created', 'website'=>$project], 200);
        } catch (JWTException $e) {
            return Response::json(['error' => 'This Project is already exist'], 500);
        }
    }

    public function updateProject(Request $request) {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 500);
        }
        try {
            $project = Project::find($request->get('id'));
            $project->update([
                'name' => $request->get('name'),
                'user_id' => $request->get('user_id'),
            ]);

            return Response::json(['success' => 'Project is Successfully updated', 'website'=>$project], 200);
        } catch (JWTException $e) {
            return Response::json(['error' => 'This Project is already exist'], 500);
        }
    }

    public function deleteProject(Request $request) {
        $project = Project::find($request->get('id'));
        try {
            $project->delete();
            return response()->json(['success'=>'Project Successfully Removed']);
        } catch(JWTException $e) {
            return response()->json(['error'=>'Project Remove Failed']);
        }
    }

    public function getProjects() {
//        $page = Input::get('pageNo') != "null" ? Input::get('pageNo') : 1;
//        $limit = Input::get('numPerPage') != "null" ? Input::get('numPerPage') : 10;
        $totalCount = count(Project::all());
        $projects = Project::all();
//        $websites = Website::orderBy('updated_at', 'desc')->skip(($page - 1) * $limit)->take($limit)->get();
        if ($totalCount == 0) {
            return response()->json(['totalCount'=>$totalCount, 'data'=>[]], 200);
        } else {
            return response()->json(['totalCount'=>$totalCount, 'data'=>$projects], 200);
        }
    }

    public function getProjectById(Request $request) {
//        $webID = Input::get('webId') != "null" ? Input::get('webId') : 1;
        try {
            $project = Project::find($request->get('id'));
            return response()->json(['result'=>'success', 'data'=>$project], 200);
        } catch (JWTException $e) {
            return response()->json(['error'=>'Project with this id is not exist'], 404);
        }
    }
}
