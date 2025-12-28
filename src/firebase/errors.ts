export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore permission denied on ${context.operation} at ${context.path}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }

  toString(): string {
    let output = `${this.name}: ${this.message}`;
    if (this.context.requestResourceData) {
      output += `\nRequest Data: ${JSON.stringify(this.context.requestResourceData, null, 2)}`;
    }
    return output;
  }
}
