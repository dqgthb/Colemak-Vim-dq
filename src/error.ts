interface IErrorMessage {
  [index: number]: string;
}

export enum ErrorCode {
  InvalidAddress = 14,
  MarkNotSet = 20,
  NoAlternateFile = 23,
  NoInsertedTextYet = 29,
  NoFileName = 32,
  NoPreviousCommand = 34,
  NoPreviousRegularExpression = 35,
  NoWriteSinceLastChange = 37,
  ErrorWritingToFile = 208,
  RecursiveMapping = 223,
  NoStringUnderCursor = 348,
  NothingInRegister = 353,
  InvalidRegisterName = 354,
  SearchHitTop = 384,
  SearchHitBottom = 385,
  CannotCloseLastWindow = 444,
  ArgumentRequired = 471,
  InvalidArgument = 474,
  NoRangeAllowed = 481,
  PatternNotFound = 486,
  TrailingCharacters = 488,
  NotAnEditorCommand = 492,
  NoBuffersDeleted = 516,
  UnknownOption = 518,
  AtStartOfChangeList = 662,
  AtEndOfChangeList = 663,
  ChangeListIsEmpty = 664,
}

export const ErrorMessage: IErrorMessage = {
  14: 'Invalid address',
  20: 'Mark not set',
  23: 'No alternate file',
  29: 'No inserted text yet',
  32: 'No file name',
  34: 'No previous command',
  35: 'No previous regular expression',
  37: 'No write since last change (add ! to override)',
  208: 'Error writing to file',
  223: 'Recursive mapping',
  348: 'No string under cursor',
  353: 'Nothing in register', // TODO: this needs an extra value ("Nothing in register x")
  354: 'Invalid register name',
  384: 'Search hit TOP without match for',
  385: 'Search hit BOTTOM without match for',
  444: 'Cannot close last window',
  471: 'Argument required',
  474: 'Invalid argument',
  481: 'No range allowed',
  486: 'Pattern not found',
  488: 'Trailing characters',
  492: 'Not an editor command',
  516: 'No buffers were deleted',
  518: 'Unknown option',
  662: 'At start of changelist',
  663: 'At end of changelist',
  664: 'changelist is empty',
};

export class VimError extends Error {
  public readonly code: number;
  public override readonly message: string;

  private constructor(code: number, message: string) {
    super();
    this.code = code;
    this.message = message;
  }

  static fromCode(code: ErrorCode, extraValue?: string): VimError {
    if (ErrorMessage[code]) {
      return new VimError(code, ErrorMessage[code] + (extraValue ? `: ${extraValue}` : ''));
    }

    throw new Error('unknown error code: ' + code);
  }

  override toString(): string {
    return `E${this.code}: ${this.message}`;
  }
}

/**
 * Used to stop a remapping or a chain of nested remappings after a VimError, a failed action
 * or the force stop recursive mapping key (<C-c> or <Esc>). (Vim doc :help map-error)
 */
export class ForceStopRemappingError extends Error {
  constructor(reason: string = 'StopRemapping') {
    super(reason);
  }

  static fromVimError(vimError: VimError): ForceStopRemappingError {
    return new ForceStopRemappingError(vimError.toString());
  }
}
