export interface Checklist {
  id: string;
  title: string;
}

export type AddChecklist = Omit<Checklist, 'id'>;
export type EditCheckList = { id: Checklist['id']; data: AddChecklist };
export type RemoveChecklist = Checklist['id'];
