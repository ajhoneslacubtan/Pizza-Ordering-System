# funtion that returns the total number of sales per month
from dateutil import parser
from datetime import date

_dict1 = {1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'}

def get_all_sales(data: list[dict]) -> dict:
    """
    Returns the total sales per month
    :param data: dict
    :return: dict
    """

    from datetime import date

    tz = []
    sales = []
    years = []

    if data is not None:
        for i in data:
            date = parser.parse(i['order_date'])
            years.append(date.year)
            _dict = {'date' : date, 'month': date.month, 'year': date.year}
            tz.append(_dict)
            sales.append(i['total_price'])
    else:
        year_now = date.today().year
        return {year_now: {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0}}

    
    return_dict = {}

    for k in years:
        _dict2 = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0}
        _temp = {}
        for i, j in zip(tz, sales):
            _dict2[i['month']] += j

        for i, j in _dict1.items():
            _temp[j] = _dict2[i]
        
        return_dict[k] = _temp

    return return_dict

def top_this_month(data: list[dict], product_name: list[str]) -> list[tuple]:
    """
    Returns the top sales this month
    :param data: dict
    :return: dict
    """
    dat = []

    for i in data:
        daten = parser.parse(i['order_date'])
        if daten.year == date.today().year and daten.month == date.today().month:
            _dict = {'product_name': i['product_name'], 'subtotal': i['subtotal']}
            dat.append(_dict)

    _dict = {}
    for i in product_name:
        _dict[i] = 0

    for i in dat:
        _dict[i['product_name']] += i['subtotal']

    sort = sorted(_dict.items(), key=lambda x: x[1])

    return sort[-5:]

def get_products(data: dict) -> list:
    prod_names = []

    for i in data['products']:
        prod_names.append(i['product_name'])

    unq = set(prod_names)

    return list(unq)

def top_all_time(data: dict, product_name: list[str]) -> list[tuple]:
    """
    Returns the top sales all time
    :param data: dict
    :return: dict
    """

    dat = []

    for i in data:
        _dict = {'product_name': i['product_name'], 'subtotal': i['subtotal']}
        dat.append(_dict)

    _dict = {}

    for i in product_name:
        _dict[i] = 0

    for i in dat:
        _dict[i['product_name']] += i['subtotal']

    sort = sorted(_dict.items(), key=lambda x: x[1])

    return sort[-5:]

def get_sales_this_month(data: dict) -> int:
    """
    Returns the total sales this month
    :param data: dict
    :return: int
    """
    month_now = date.today().month
    result = data[_dict1[month_now]]

    return result


def get_sales_growth(data: dict) -> str:
    """
    Returns the sales growth
    :param data: dict
    :return: str
    """

    month_now = date.today().month

    present = data[_dict1[month_now]]
    if month_now != 1:
        past = data[_dict1[month_now - 1]]
    else:
        past = data[_dict1[12]]
    
    try:
        rate = round((present - past) / past * 100, 2)
    except ZeroDivisionError:
        rate = 0

    return str(rate) + '%'

def get_total_sales(data: dict) -> int:
    """
    Returns the total sales
    :param data: dict
    :return: int
    """

    total = 0

    for i, j in data.items():
        for k, l in j.items():
            total += l

    return total

def get_sold_sizes(data: dict) -> dict:
    """
    Returns the total sales by size
    :param data: dict
    :return: dict
    """

    sizes = {'9': 0, '12': 0}

    for i in data['order_details']:
        sizes[i['product_size']] += i['subtotal']

    return sizes


def sales(ordersData: dict, orderDetailsData: dict, productsData: list) -> dict:
    """
    Returns the total sales
    :param ordersData: dict
    :param orderDetailsData: dict
    :return: dict
    """

    _dict = {'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12}

    temp = {}
    glabels = []
    gdata = []
    sales = {}
    clabels = []
    cdata = []
    alabels = []
    adata = []
    
    year_now = date.today().year

    try:
        for i, j in get_all_sales(ordersData)[year_now].items():
            temp[_dict[i]] = j
    except KeyError:
        for i in range(1, 13):
            temp[i] = 0

    for i, j in temp.items():
        glabels.append(_dict1[i])
        gdata.append(j)

    sales['tsgraph'] = {'glabels': glabels, 'gdata': gdata}
    
    # Top 5 sales this month
    result = top_this_month(orderDetailsData['order_details'], productsData)
    for i in result:
        clabels.append(i[0])
        cdata.append(i[1])

    sales['top_this_month'] = {'labels': clabels, 'data': cdata}

    # Top 5 sales all time

    result = top_all_time(orderDetailsData['order_details'], productsData)

    for i in result:
        alabels.append(i[0])
        adata.append(i[1])
    
    sales['top_all_time'] = {'labels': alabels, 'data': adata}

    # Sales this month

    try:
        sales['sales_this_month'] = get_sales_this_month(get_all_sales(ordersData)[year_now])
    except KeyError:
        sales['sales_this_month'] = 0

    # Sales growth

    try:
        sales['sales_growth'] = get_sales_growth(get_all_sales(ordersData)[year_now])
    except KeyError:
        sales['sales_growth'] = '0%'

    # Total sales

    sales['total_sales'] = get_total_sales(get_all_sales(ordersData))

    # Sales by size

    sales['sold_sizes'] = get_sold_sizes(orderDetailsData)

    sales['status'] = 'OK'

    return sales