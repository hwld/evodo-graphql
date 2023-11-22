"use client";

import { graphql } from "@/gql";
import { OperationContext, useMutation, useQuery } from "urql";
import { TaskItem } from "./task-item/task-item";
import { useMemo, useState } from "react";
import { Task } from "@/gql/graphql";
import { TaskDeleteDialog } from "./task-delete-dialog";

const TaskListQuery = graphql(`
  query TodoListQuery {
    myTasks {
      id
      ...TaskItemFragment
    }
  }
`);

const DeleteTask = graphql(`
  mutation DeleteTaskMutation($id: ID!) {
    deleteTask(id: $id) {
      task {
        id
      }
    }
  }
`);

export const TaskList: React.FC = () => {
  const context: Partial<OperationContext> = useMemo(() => {
    return { additionalTypenames: ["Task" satisfies Task["__typename"]] };
  }, []);
  const [{ data, fetching, error }] = useQuery({
    query: TaskListQuery,
    context,
  });
  const [taskIdToDelete, setTaskIdToDelete] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [{ fetching: deletingTask }, deleteTaskMutation] =
    useMutation(DeleteTask);

  const handleOpen = (taskId: string) => {
    setTaskIdToDelete(taskId);
    setIsOpen(true);
  };

  const handleDeleteTask = async (): Promise<"success" | "error"> => {
    if (!taskIdToDelete) {
      return "error";
    }

    const result = await deleteTaskMutation({ id: taskIdToDelete });
    if (result.error) {
      window.alert("タスクが削除できませんでした。");
      return "error";
    }

    return "success";
  };

  if (fetching) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {data?.myTasks.map((t) => {
          return (
            <div key={t.id}>
              <TaskItem
                task={t}
                onOpenTaskDeleteDialog={handleOpen}
                deletingTask={taskIdToDelete === t.id && deletingTask}
              />
            </div>
          );
        })}
      </div>
      <TaskDeleteDialog
        isOpen={isOpen}
        onDeleteTask={handleDeleteTask}
        onOpenChange={setIsOpen}
        deleting={deletingTask}
      />
    </>
  );
};
