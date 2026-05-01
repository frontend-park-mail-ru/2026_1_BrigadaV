import { SearchResult } from '../../model/types';

export type PlaceDropDownListProps = {
   emptyPromptHeader?: string;
   emptyItemSet?: SearchResult[];
}

export type PlaceDropDownStates = 'hidden' | 'empty' | 'prompt' | 'no-results';
