<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'project_id', 'user_id', 'title', 'type', 'start', 'end', 'complete', 'multi_day'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
