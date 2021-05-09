import {Injectable} from '@angular/core';
import {WebRequestService} from './web-request.service';
import {Task} from './models/task.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService,
              private router: Router) {
  }

  getLists() {
    return this.webReqService.get('lists');
  }

  createList(title: string) {
    // we want to send a web request to create a list
    // URLに注意
    return this.webReqService.post('lists', {title});
  }

  updateList(id: string, title: string) {
    // we want to send a web request to create a list
    return this.webReqService.patch(`lists/${id}`, {title});
  }

  updateTask(listId: string, taskId: string, title: string) {
    // we want to send a web request to create a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, {title});
  }

  deleteTask(listId: string, taskId: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  deleteList(id: string) {
    return this.webReqService.delete(`lists/${id}`);
  }

  //
  // deleteList(id: string){
  //   return this.webReqService.delete(`lists/${id}`).subscribe((res: any) => {
  //     this.router.navigate(['/lists']);
  //     console.log(res);
  //   });
  // }

  getTasks(listId: string) {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  createTask(title: string, listId: string) {
    // we want to send a web request to create a task
    return this.webReqService.post(`lists/${listId}/tasks`, {title});
  }

  complete(task: Task){
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      // completed: true
      // serverの状態を更新
      completed: !task.completed
    });
  }

}
