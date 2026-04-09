const pluralRules = new Intl.PluralRules('ru-RU');

type wordForms = {
    one: string;
    few: string;
    many: string;
    other?: string;
}

export const pluralize = (number: number, forms: wordForms): string => {
    const rule = pluralRules.select(number) as keyof wordForms;
    return forms[rule] || forms.many;
}
