import { Component, OnInit } from '@angular/core';
import { LevelsServiceService } from './levels-service.service';

import { remove, find, update } from 'lodash';
import { NewLevel } from './new-level';
import { NewClass } from './new-class';
import { NewSubject } from './new-subject';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css'],
  providers: [LevelsServiceService]
})

export class LevelsComponent implements OnInit {
  levels: any[];
  currentForm: any;
  currentFormOptions: any;
  currentFunction: Function;

  levelFormOptions = {
    name: {
      type: 'text',
      required: true,
      minLength: 5,
      placeholder: 'Level Name'
    },
    priority: {
      type: 'number',
      required: true,
      min: 0,
      placeholder: 'Level Priority'
    }
  }

  classFormOptions = {
    name: {
      type: 'text',
      required: true,
      minLength: 5,
      placeholder: 'Class Name'
    },
    capacity: {
      type: 'number',
      required: true,
      max: 25,
      placeholder: 'Class Max capacity'
    },
    minGrade: {
      type: 'number',
      placeholder: 'Min Grade'
    }
  }

  subjectFormOptions = {
    name: {
      type: 'text',
      required: true,
      minLength: 5,
      placeholder: 'Subject Name'
    },
    details: {
      type: 'textarea',
      required: true,
      minLength: 5,
      placeholder: 'Subject details'
    },
    syllabus: {
      type: 'textarea',
      required: true,
      minLength: 5,
      placeholder: 'Subject Syllabus'
    }
  }

  constructor(private service: LevelsServiceService) { }

  ngOnInit() {
    this.service.init().subscribe(({ data }) => {
      this.levels = data.levels;
    });
  }

  openAccordion(x) {
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else {
      x.className = x.className.replace(" w3-show", "");
    }
  }

  limit(text: string, limit: number) {
    return text.length > 30? text.substr(0, 30)+'...' : text;
  }

  newLevel(level) {
    this.currentFormOptions = this.levelFormOptions;
    if (level) {
      this.currentForm = new NewLevel(level.name, level.priority, level.id);
      this.currentFunction = this.updateLevel;
    } else {
      this.currentForm = new NewLevel();
      this.currentFunction = this.createLevel;
      delete this.currentForm.id;
    }
  }

  createLevel(level) {
    this.service.createLevel(level).subscribe(({ data }) => {
      this.levels.push(data.createLevel);
      alert('created');
    });
  }

  updateLevel(level) {
    let oldLevel = find(this.levels, { id: level.id });
    this.service.updateLevel(level)
      .subscribe(({ data }) => {
        oldLevel.name = level.name;
        oldLevel.priority = level.priority;
        alert('updated');
      });
  }

  deleteLevel(levelId) {
    let confirmation = confirm("Are you sure you want to delete the level?");
    if (confirmation) {
      this.service.deleteLevel(levelId)
        .subscribe(data => {
          remove(this.levels, { id: levelId });
        });
    }

  }

  newClass(levelId, Class) {
    this.currentFormOptions = this.classFormOptions;
    if (Class) {
      this.currentForm =
        new NewClass(Class.name, Class.capacity, Class.minGrade, Class.levelId, Class.id);
      this.currentFunction = this.updateClass;
    } else {
      this.currentForm = new NewClass();
      this.currentForm.levelId = levelId;
      this.currentFunction = this.createClass;
    }
  }

  createClass(Class) {
    let level = find(this.levels, { id: Class.levelId });
    this.service.createClass(Class)
      .subscribe(({ data }) => {
        level.classes.push(data.createClass);
        alert('created');
      });
  }

  updateClass(Class) {
    let level = find(this.levels, { id: Class.levelId });
    let oldClass = find(level.classes, { id: Class.id });
    for (let c in Class) {
      oldClass[c] = Class[c];
    }

    this.service.updateClass(Class)
      .subscribe(({ data }) => {
        alert('updated');
      });
  }

  deleteClass(classId, level) {
    let confirmation = confirm("Are you sure you want to delete this class?");
    if (confirmation) {
      this.service.deleteClass(classId)
        .subscribe(({ data }) => {
          remove(level.classes, { id: classId });
        });
    }
  }

  newSubject(levelId, subject) {
    this.currentFormOptions = this.subjectFormOptions;
    if (subject) {
      this.currentForm =
        new NewSubject(subject.name, subject.details, subject.syllabus, subject.levelId, subject.id);
      this.currentFunction = this.updateSubject;
    } else {
      this.currentForm = new NewSubject();
      this.currentForm.levelId = levelId;
      this.currentFunction = this.createSubject;
    }
  }

  createSubject(subject) {
    let level = find(this.levels, { id: subject.levelId });
    this.service.createSubject(subject)
      .subscribe(({ data }) => {
        level.subjects.push(data.createSubject);
        alert('created');
      });
  }

  updateSubject(subject) {
    let level = find(this.levels, { id: subject.levelId });
    let oldSubject = find(level.subjects, { id: subject.id });
    for (let c in subject) {
      oldSubject[c] = subject[c];
    }

    this.service.updateSubject(subject)
      .subscribe(({ data }) => {
        alert('updated');
      });
  }

  deleteSubject(subjectId, level) {
    let confirmation = confirm("Are you sure you want to delete this subject?");
    if (confirmation) {
      this.service.deleteSubject(subjectId)
        .subscribe(({ data }) => {
          remove(level.subjects, { id: subjectId });
        });
    }
  }
}
