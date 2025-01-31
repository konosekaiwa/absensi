//app/lib/types.ts
export interface TaskForTable {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
  assignedTo: {
    username: string;
  } | null;  // assignedTo adalah objek dengan properti username atau null
}


export interface TaskForEdit {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
  assignedTo: {
    username: string;
  } | null;  //
}
