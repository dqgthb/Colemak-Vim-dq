import { JumpTracker } from '../jumps/jumpTracker';
import { ModeName } from '../mode/mode';
import { Position } from '../common/motion/position';
import { RecordedState } from './../state/recordedState';
import { SearchHistory } from '../history/historyFile';
import { SearchState, SearchDirection } from './searchState';
import { SubstituteState } from './substituteState';

/**
 * State which stores global state (across editors)
 */
export class GlobalState {
  /**
   * The keystroke sequence that made up our last complete action (that can be
   * repeated with '.').
   */
  private static _previousFullAction: RecordedState | undefined = undefined;

  /**
   * Previous searches performed
   */
  private static _searchStatePrevious: SearchState[] = [];

  /**
   * Last substitute state for running :s by itself
   */
  private static _substituteState: SubstituteState | undefined = undefined;

  /**
   * Last search state for running n and N commands
   */
  private static _searchState: SearchState | undefined = undefined;

  /**
   *  Index used for navigating search history with <up> and <down> when searching
   */
  private static _searchStateIndex: number = 0;

  /**
   * Used internally for nohl.
   */
  private static _hl = true;

  /**
   * Track jumps, and traverse jump history
   */
  private static _jumpTracker: JumpTracker = new JumpTracker();

  /**
   * Tracks search history
   */
  private static _searchHistory: SearchHistory | undefined;

  /**
   * Getters and setters for changing global state
   */
  public get searchStatePrevious(): SearchState[] {
    return GlobalState._searchStatePrevious;
  }

  public set searchStatePrevious(states: SearchState[]) {
    GlobalState._searchStatePrevious = GlobalState._searchStatePrevious.concat(states);
  }

  public async load() {
    if (GlobalState._searchHistory === undefined) {
      GlobalState._searchHistory = new SearchHistory();
      await GlobalState._searchHistory.load();
      GlobalState._searchHistory
        .get()
        .forEach(val =>
          this.searchStatePrevious.push(
            new SearchState(
              SearchDirection.Forward,
              new Position(0, 0),
              val,
              undefined,
              ModeName.Normal
            )
          )
        );
    }
  }

  public addNewSearchHistoryItem(searchString: string) {
    if (GlobalState._searchHistory !== undefined) {
      GlobalState._searchHistory.add(searchString);
    }
  }

  public get previousFullAction(): RecordedState | undefined {
    return GlobalState._previousFullAction;
  }

  public set previousFullAction(state: RecordedState | undefined) {
    GlobalState._previousFullAction = state;
  }

  public get substituteState(): SubstituteState | undefined {
    return GlobalState._substituteState;
  }

  public set substituteState(state: SubstituteState | undefined) {
    GlobalState._substituteState = state;
  }

  public get searchState(): SearchState | undefined {
    return GlobalState._searchState;
  }

  public set searchState(state: SearchState | undefined) {
    GlobalState._searchState = state;
  }

  public get searchStateIndex(): number {
    return GlobalState._searchStateIndex;
  }

  public set searchStateIndex(state: number) {
    GlobalState._searchStateIndex = state;
  }

  public get hl(): boolean {
    return GlobalState._hl;
  }

  public set hl(enabled: boolean) {
    GlobalState._hl = enabled;
  }

  public get jumpTracker(): JumpTracker {
    return GlobalState._jumpTracker;
  }
}
