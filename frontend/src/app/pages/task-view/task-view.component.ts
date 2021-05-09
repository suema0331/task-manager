import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../task.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Task} from '../../models/task.model';
import {List} from '../../models/list.model';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  lists: List[];
  tasks: Task[];
  // 選択されているlistId保存
  selectedListId: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        // URLパラメータを取得
        // console.log(params);
        if (params.listId){
          this.selectedListId = params.listId;
          this.taskService.getTasks(params.listId).subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          });
        } else{
          this.tasks = undefined;
        }
      }
    );

    this.taskService.getLists().subscribe((lists: List[]) => {
      // dbのlistsオブジェクトを全件表示
      console.log(lists);
      this.lists = lists;
    });
  }

  onTaskClick(task: Task) {
    // we want to set the task to complete
     this.taskService.complete(task).subscribe(() => {
       // valueをupdateする必要はない
       // the task has been set to completed successfully
       console.log('completed');
       task.completed = !task.completed;
     });
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    });
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    });
  }
}
