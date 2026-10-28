<?php

namespace App\Http\Controllers;

use App\Models\Court;
use Illuminate\Http\Request;

class CourtController extends Controller
{
    public function index()
    {
        return response()->json(Court::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_hour' => 'required|numeric',
            'is_active' => 'boolean',
        ]);

        $court = Court::create($validated);

        return response()->json($court, 201);
    }

    public function show($id)
    {
        return response()->json(Court::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $court = Court::findOrFail($id);
        $court->update($request->all());

        return response()->json($court);
    }

    public function destroy($id)
    {
        $court = Court::findOrFail($id);
        $court->delete();

        return response()->json(['message' => 'Court deleted']);
    }
}
