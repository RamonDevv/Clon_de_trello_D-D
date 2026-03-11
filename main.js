const To_Do_list = document.getElementById("task-list_To_Do");
const In_Progress_list = document.getElementById("In_Progress_task-list");
const Completed_list = document.getElementById("Completed_task-list");

Sortable.create(To_Do_list, {
    group: 'shared',
  animation: 150
});

Sortable.create(In_Progress_list, {
    group: 'shared',
    animation: 150
})

Sortable.create(Completed_list, {
    group: 'shared',
    animation: 150
})