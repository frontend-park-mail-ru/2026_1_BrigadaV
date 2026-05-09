

export type EditTripDialogProps = {
    modalId: string;
}

type TripEditableKeys = 'title' | 'location' | 'description' | 'startDate' | 'endDate';

type KebabCase<S extends string> = S extends `${infer T}${infer U}`
    ? U extends Uncapitalize<U>
    ? `${Uncapitalize<T>}${KebabCase<U>}`
    : `${Uncapitalize<T>}-${KebabCase<Uncapitalize<U>>}`
    : S;

export type EditTripDialogFields = {
    [K in TripEditableKeys as KebabCase<K>]: string;
};

export type EditTripInitValues = Pick<Trip, 'id' | TripEditableKeys>;

export type DeleteTripPayload = Pick<Trip, 'id'>;

export type UpdateTripPayload = Pick<Trip, TripEditableKeys> & Pick<Trip, 'id'>;
