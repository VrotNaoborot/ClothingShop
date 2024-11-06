from django import template

register = template.Library()


@register.filter
def mul(value1, value2):
    """Умножает два значения."""
    try:
        return value1 * value2
    except TypeError:
        return ''


@register.filter
def space_separator(value):
    """Форматирует число с пробелами как разделителями."""
    return '{:,.0f}'.format(value).replace(',', ' ')