export class IscoNode {
    constructor(
      public code: string,
      public name: string,
      public level: string,
      public parentCode?: string
    ) {}
  
    get label(): string {
      return this.name;
    }
  
    get display(): string {
      return this.parentName ? `${this.parentName} – ${this.name}` : this.name;
    }
  
    parentName?: string;
  }
  