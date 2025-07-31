"use client"

import React, { useState } from 'react'
import { Settings as SettingsIcon, Plus, Edit, Trash2, FolderOpen, Tag, Users, Palette } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTodoStore } from '@/store/todo-store'
import { Project, Area } from '@/types'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project?: Project | null
}

interface AreaModalProps {
  isOpen: boolean
  onClose: () => void
  area?: Area | null
}

const colorOptions = [
  { value: 'bg-blue-100 text-blue-700', label: 'Blau', preview: 'bg-blue-100' },
  { value: 'bg-green-100 text-green-700', label: 'Grün', preview: 'bg-green-100' },
  { value: 'bg-orange-100 text-orange-700', label: 'Orange', preview: 'bg-orange-100' },
  { value: 'bg-purple-100 text-purple-700', label: 'Lila', preview: 'bg-purple-100' },
  { value: 'bg-pink-100 text-pink-700', label: 'Rosa', preview: 'bg-pink-100' },
  { value: 'bg-red-100 text-red-700', label: 'Rot', preview: 'bg-red-100' },
  { value: 'bg-yellow-100 text-yellow-700', label: 'Gelb', preview: 'bg-yellow-100' },
  { value: 'bg-indigo-100 text-indigo-700', label: 'Indigo', preview: 'bg-indigo-100' },
]

const availableAssignees = [
  { id: 'OA', name: 'Oliver Ackermann' },
  { id: 'AL', name: 'Anna Lutz' },
  { id: 'IJ', name: 'Isabel Jansen' },
  { id: 'MH', name: 'Max Hoffmann' },
  { id: 'SK', name: 'Sarah Klein' },
  { id: 'TW', name: 'Tom Weber' },
]

function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { addProject, updateProject } = useTodoStore()
  const [name, setName] = useState('')
  const [color, setColor] = useState('bg-blue-100 text-blue-700')
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])

  // Update form when project changes
  React.useEffect(() => {
    if (project) {
      setName(project.name)
      setColor(project.color)
      setSelectedAssignees(project.allowedAssignees)
    } else {
      setName('')
      setColor('bg-blue-100 text-blue-700')
      setSelectedAssignees([])
    }
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (project) {
      updateProject(project.id, {
        name: name.trim(),
        color,
        allowedAssignees: selectedAssignees,
      })
    } else {
      addProject({
        user_id: 'user-1',
        name: name.trim(),
        color,
        allowedAssignees: selectedAssignees,
      })
    }

    setName('')
    setColor('bg-blue-100 text-blue-700')
    setSelectedAssignees([])
    onClose()
  }

  const toggleAssignee = (assigneeName: string) => {
    setSelectedAssignees(prev => 
      prev.includes(assigneeName) 
        ? prev.filter(name => name !== assigneeName)
        : [...prev, assigneeName]
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg border shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold mb-4">
          {project ? 'Projekt bearbeiten' : 'Neues Projekt'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Projektname"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Farbe</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-full h-8 rounded border-2 ${option.preview} ${
                    color === option.value ? 'border-gray-800' : 'border-gray-200'
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Erlaubte Assignees</Label>
            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
              {availableAssignees.map((assignee) => (
                <label key={assignee.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAssignees.includes(assignee.name)}
                    onChange={() => toggleAssignee(assignee.name)}
                    className="rounded"
                  />
                  <span className="text-sm">{assignee.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {project ? 'Aktualisieren' : 'Erstellen'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AreaModal({ isOpen, onClose, area }: AreaModalProps) {
  const { addArea, updateArea } = useTodoStore()
  const [name, setName] = useState('')
  const [color, setColor] = useState('bg-blue-100 text-blue-700')

  // Update form when area changes
  React.useEffect(() => {
    if (area) {
      setName(area.name)
      setColor(area.color)
    } else {
      setName('')
      setColor('bg-blue-100 text-blue-700')
    }
  }, [area])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (area) {
      updateArea(area.id, {
        name: name.trim(),
        color,
      })
    } else {
      addArea({
        user_id: 'user-1',
        name: name.trim(),
        color,
      })
    }

    setName('')
    setColor('bg-blue-100 text-blue-700')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg border shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold mb-4">
          {area ? 'Area bearbeiten' : 'Neue Area'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="area-name">Name</Label>
            <Input
              id="area-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Area-Name"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Farbe</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-full h-8 rounded border-2 ${option.preview} ${
                    color === option.value ? 'border-gray-800' : 'border-gray-200'
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {area ? 'Aktualisieren' : 'Erstellen'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { projects, areas, deleteProject, deleteArea } = useTodoStore()
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingArea, setEditingArea] = useState<Area | null>(null)

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsProjectModalOpen(true)
  }

  const handleEditArea = (area: Area) => {
    setEditingArea(area)
    setIsAreaModalOpen(true)
  }

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false)
    setEditingProject(null)
  }

  const handleCloseAreaModal = () => {
    setIsAreaModalOpen(false)
    setEditingArea(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalte deine Projekte und Areas für die Aufgabenorganisation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projekte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Projekte
            </CardTitle>
            <CardDescription>
              Verwalte deine Projekte mit Farben und Berechtigungen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => setIsProjectModalOpen(true)}
                className="w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Neues Projekt
              </Button>

              {projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Noch keine Projekte erstellt</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${project.color}`}>
                          {project.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {project.allowedAssignees.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditProject(project)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteProject(project.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Areas
            </CardTitle>
            <CardDescription>
              Verwalte deine Areas für die Kategorisierung von Aufgaben.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => setIsAreaModalOpen(true)}
                className="w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Neue Area
              </Button>

              {areas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Noch keine Areas erstellt</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {areas.map((area) => (
                    <div key={area.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${area.color}`}>
                        {area.name}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditArea(area)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteArea(area.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        project={editingProject}
      />

      <AreaModal
        isOpen={isAreaModalOpen}
        onClose={handleCloseAreaModal}
        area={editingArea}
      />
    </div>
  )
} 