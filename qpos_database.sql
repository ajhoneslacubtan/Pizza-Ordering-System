create table if not exists USERS(
	user_id serial primary key,
	user_name varchar(50),
	user_pass varchar(20),
	user_role varchar(5),
	user_image text
);

create table if not exists ORDERS(
	order_code varchar(15) primary key,
	order_date timestamptz,
	order_status varchar(10),
	customer_name varchar(50),
	total_price float
);

create table if not exists PRODUCTS(
	product_code varchar(10) primary key,
	product_name varchar(20),
	product_describe text,
	product_image text
);
create table if not exists ORDER_DETAILS(
	order_code varchar(15),
	product_code varchar(10),
	product_size varchar(5),
	quantity integer,
	subtotal float,
	PRIMARY KEY (order_code, product_code, product_size),
	FOREIGN KEY (order_code) REFERENCES ORDERS(order_code),
	FOREIGN KEY (product_code) REFERENCES PRODUCTS(product_code)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);
create table if not exists PROD_PRICE_AVAILABILITY(
	product_code varchar(10),
	user_id varchar(10),
	product_price float,
	product_avail boolean,
	product_size varchar(5),
	date_modified timestamptz,
	FOREIGN KEY (product_code) REFERENCES PRODUCTS(product_code)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (user_id) REFERENCES USERS(user_id)
		ON DELETE SET NULL
);
-- -- USE CASE ON PRODUCTS ---

CREATE OR REPLACE FUNCTION ADD_PRODUCT(par_product_code varchar, product_name varchar, product_image text, product_describe text, price_9in float, price_12in float, u_id varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	cur_date timestamptz;
	loc_id text;
	loc_res text;
begin
	select into loc_id product_code from PRODUCTS where product_code = par_product_code;
	if loc_id isnull then
		cur_date = CAST(current_timestamp as timestamptz);
		insert into PRODUCTS VALUES (par_product_code, product_name, product_describe, product_image);
		insert into PROD_PRICE_AVAILABILITY VALUES (par_product_code, u_id, price_9in, TRUE, '9', cur_date);
		insert into PROD_PRICE_AVAILABILITY VALUES (par_product_code, u_id, price_12in, TRUE, '12', cur_date);
		loc_res = 'OK';
	else 
		loc_res = 'Product code already exists';
	end if;
	return json_build_object(
				'status', loc_res);
end;
$$;

-- select ADD_PRODUCT('PZ-AC', 'All Cheese', 'res/hw.jpeg', 'This is a description', 169, 420, 'admin');
-- select ADD_PRODUCT('PZ-HW', 'Hawaiian', 'res/hw.jpeg', 'This is a description', 170, 400, 'admin');
-- select ADD_PRODUCT('PZ-PE', 'Pepperoni', 'res/hw.jpeg', 'This is a description', 175, 350, 'admin');
-- select ADD_PRODUCT('PZ-HW', 'Hawaiian', 'res/hw.jpeg', 'This is a description', 170, 400, 'admin');
-- select ADD_PRODUCT('PZ-PE', 'Pepperoni', 'res/hw.jpeg', 'This is a description', 175, 350, 'admin');
-- select ADD_PRODUCT('PZ-PE', 'Pepperoni', 'res/hw.jpeg', 'This is a description', 175, 350, 'admin');
-- select ADD_PRODUCT('PZ-AC', 'All Cheese', 'res/hw.jpeg', 'This is a description', 169, 420, 'admin');
-- select ADD_PRODUCT('PZ-AC', 'All Cheese', 'res/hw.jpeg', 'This is a description', 169, 420, 'admin');
-- select ADD_PRODUCT('PZ-HW', 'Hawaiian', 'res/hw.jpeg', 'This is a description', 170, 400, 'admin');
-- select ADD_PRODUCT('PZ-AC', 'All Cheese', 'res/hw.jpeg', 'This is a description', 169, 420, 'admin');

CREATE OR REPLACE FUNCTION UPDATE_PRODUCT(p_code varchar, p_name varchar, p_describe text, p_image text) RETURNS json
	LANGUAGE plpgsql
	AS $$
	DECLARE
		loc_id text;
		loc_res text;
begin
	select into loc_id product_code from PRODUCTS where product_code = p_code;
	if loc_id is not null then
		UPDATE PRODUCTS SET product_name=p_name, product_describe=p_describe, product_image=p_image
		WHERE product_code=p_code;
		loc_res = 'OK';
	else
		loc_res = 'Product not found!';
	end if;
	return json_build_object(
				'status', loc_res);
end;
$$;

-- select UPDATE_PRODUCT('PZ-HW', 'Hawaiian', 'This is a pizza', 'res/img/hw.jpeg');
-- select UPDATE_PRODUCT('PZ-HW', 'Hawaiian', 'This is a pizza (Updated)', 'res/img/hw.jpeg');

CREATE OR REPLACE FUNCTION UPDATE_PRODUCT_STATUS(p_code varchar, u_id varchar, p_avail boolean, p_size varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	cur_date timestamp;
	recent_price record;
	rec_price float;
	loc_id text;
	loc_res text;
begin
	select into loc_id product_code from PRODUCTS where product_code = p_code;
	if loc_id is not null then
		cur_date = CAST(current_timestamp as timestamp);
		select into recent_price t.product_code, t.product_price, t.date_modified
				from PROD_PRICE_AVAILABILITY t
				inner join (
					select product_code, max(date_modified) as MaxDate, product_size
					from PROD_PRICE_AVAILABILITY
					group by product_code, product_size
				) tm on t.product_code = tm.product_code and t.date_modified = tm.MaxDate 
				WHERE tm.product_code=p_code and tm.product_size=p_size;
		rec_price = CAST(recent_price.product_price as float);
		insert into PROD_PRICE_AVAILABILITY VALUES (p_code, u_id, rec_price, p_avail, p_size, cur_date);
		loc_res = 'OK';
	else
		loc_res = 'Product not found!';
	end if;
	return json_build_object(
				'status', loc_res);
end;
$$;

-- select UPDATE_PRODUCT_STATUS('PZ-HW', 'admin', FALSE, '9');

CREATE OR REPLACE FUNCTION UPDATE_PRODUCT_PRICE(p_code varchar, u_id varchar, p_price float, p_size varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	cur_date timestamp;
	recent_avail record;
	rec_avail boolean;
	loc_id text;
	loc_res text;
begin
	select into loc_id product_code from PRODUCTS where product_code = p_code;
	if loc_id is not null then
		cur_date = CAST(current_timestamp as timestamp);
		select into recent_avail t.product_code, t.product_avail, t.date_modified
				from PROD_PRICE_AVAILABILITY t
				inner join (
					select product_code, max(date_modified) as MaxDate, product_size
					from PROD_PRICE_AVAILABILITY
					group by product_code, product_size
				) tm on t.product_code = tm.product_code and t.date_modified = tm.MaxDate 
				WHERE tm.product_code=p_code and tm.product_size=p_size;
		rec_avail = CAST(recent_avail.product_avail as boolean);
		insert into PROD_PRICE_AVAILABILITY VALUES (p_code, u_id, p_price, rec_avail, p_size, cur_date);
	loc_res = 'OK';
	else
		loc_res = 'Product not found!';
	end if;
	return json_build_object(
				'status', loc_res);
end;
$$;

-- select UPDATE_PRODUCT_PRICE('PZ-HW', 'admin', 123, '12');

CREATE OR REPLACE FUNCTION DELETE_PRODUCT(code varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
	DECLARE
	loc_id text;
	loc_res text;
begin
	select into loc_id product_code from PRODUCTS where product_code = code;
	if loc_id is not null then
		DELETE FROM PRODUCTS WHERE (product_code=code);
		loc_res = 'OK';
	else
		loc_res = 'Product not found!';
	end if;
	return json_build_object(
				'status', loc_res);
end;
$$;

-- select DELETE_PRODUCT('PZ-HW')

CREATE OR REPLACE FUNCTION LIST_PRODUCTS() RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	list record;
	loc_prod_record record;
	loc_prod_json json[];
	loc_size int default 0;
begin
	CREATE TEMP TABLE table_products ON COMMIT DROP AS
	select PRODUCTS.*, t.product_size, t.product_price, t.product_avail
	from PROD_PRICE_AVAILABILITY t
	inner join (
		select DISTINCT product_size, product_code, max(date_modified) as MaxDate
		from PROD_PRICE_AVAILABILITY
			group by product_code, product_size
			) tm on t.product_code = tm.product_code and t.date_modified = tm.MaxDate and t.product_size = tm.product_size
	LEFT JOIN PRODUCTS 
		ON PRODUCTS.product_code= t.product_code;
	for loc_prod_record in select * from table_products loop
		loc_prod_json = loc_prod_json ||
						json_build_object(
						'product_code', loc_prod_record.product_code,
						'product_name', loc_prod_record.product_name,
						'product_describe', loc_prod_record.product_describe,
						'product_image', loc_prod_record.product_image,
						'product_size', loc_prod_record.product_size,
						'product_prize', loc_prod_record.product_price,
						'product_avail', loc_prod_record.product_avail
						);
		loc_size = loc_size + 1;
	end loop;
	
	return json_build_object(
		'status', 'OK',
		'size', loc_size,
		'products', loc_prod_json
	);
end;
$$;

-- select LIST_PRODUCTS();

CREATE OR REPLACE FUNCTION GET_PRODUCTS_BY_SIZE(prod_size varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	list record;
	loc_prod_record record;
	loc_prod_json json[];
	loc_size int default 0;
begin
	CREATE TEMP TABLE table_products ON COMMIT DROP AS
	select PRODUCTS.product_code, PRODUCTS.product_name, PRODUCTS.product_image, t.product_price
	from PROD_PRICE_AVAILABILITY t
	inner join (
		select DISTINCT product_size, product_code, max(date_modified) as MaxDate
		from PROD_PRICE_AVAILABILITY
			group by product_code, product_size
			) tm on t.product_code = tm.product_code and t.date_modified = tm.MaxDate and t.product_size = tm.product_size
	LEFT JOIN PRODUCTS 
		ON PRODUCTS.product_code= t.product_code
	where t.product_size=prod_size and t.product_avail=TRUE;
	for loc_prod_record in select * from table_products loop
		loc_prod_json = loc_prod_json ||
						json_build_object(
						'product_code', loc_prod_record.product_code,
						'product_name', loc_prod_record.product_name,
						'product_image', loc_prod_record.product_image,
						'product_prize', loc_prod_record.product_price
						);
		loc_size = loc_size + 1;
	end loop;
	
	return json_build_object(
		'status', 'OK',
		'size', loc_size,
		'products', loc_prod_json
	);
end;
$$;

CREATE OR REPLACE FUNCTION SEARCH_PRODUCT(srch_name varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	list record;
	keyword text;
	loc_prod_record record;
	loc_prod_json json[];
	loc_size int default 0;
	loc_id text;
	loc_res text;
begin
	keyword = '%' || srch_name || '%';
	CREATE TEMP TABLE table_products ON COMMIT DROP AS
	select PRODUCTS.*, t.product_size, t.product_price, t.product_avail
		from PROD_PRICE_AVAILABILITY t
		inner join (
			select DISTINCT product_size, product_code, max(date_modified) as MaxDate
			from PROD_PRICE_AVAILABILITY
				group by product_code, product_size
				) tm on t.product_code = tm.product_code and t.date_modified = tm.MaxDate and t.product_size = tm.product_size
	LEFT JOIN PRODUCTS 
		ON PRODUCTS.product_code= t.product_code
	WHERE PRODUCTS.product_name LIKE keyword;
	for loc_prod_record in select * from table_products loop
		loc_prod_json = loc_prod_json ||
						json_build_object(
						'product_code', loc_prod_record.product_code,
						'product_name', loc_prod_record.product_name,
						'product_describe', loc_prod_record.product_describe,
						'product_image', loc_prod_record.product_image,
						'product_size', loc_prod_record.product_size,
						'product_prize', loc_prod_record.product_price,
						'product_avail', loc_prod_record.product_avail
						);
		loc_size = loc_size + 1;
	end loop;
	if loc_size != 0 then
		return json_build_object(
		'status', 'OK',
		'size', loc_size,
		'products', loc_prod_json
	);
	else
		return json_build_object(
		'status', 'Product not found!'
	);
	end if;
end;
$$;

-- select SEARCH_PRODUCT('hehe');
-- -- USE CASE ON ORDERS --

CREATE OR REPLACE FUNCTION ADD_ORDER(ord_code varchar, customer_name varchar, total float) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	o_date date;
	loc_id text;
	loc_res text;
begin
	select into loc_id order_code from ORDERS where order_code = ord_code;
	if loc_id isnull then
		o_date = CAST(current_date as date);
		insert into ORDERS VALUES(ord_code, o_date, 'PENDING', customer_name, total);
		loc_res = 'OK';
	else
		loc_res = 'Order ID already exists';
	end if;
	RETURN json_build_object(
		'status', loc_res);
end;
$$;

-- select ADD_ORDER('02', 'Hehe', 500, '09753588375');
-- select ADD_ORDER('03', 'Ohno', 300, '09123456789');
-- select ADD_ORDER('01', 'Huhu', 500, '09753588375');


CREATE OR REPLACE FUNCTION ADD_ORDER_DETAILS(ord_code varchar, p_code varchar, p_size varchar, qty integer) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	subtotal float;
	price record;
	loc_id record;
	loc_res text;
begin
	select into loc_id order_code, product_code, product_size from ORDER_DETAILS where order_code = ord_code and product_code = p_code and product_size = p_size;
	if loc_id.order_code isnull and loc_id.product_code isnull and loc_id.product_size isnull then
		select into price t.product_code, t.product_price
			from PROD_PRICE_AVAILABILITY t
				inner join (
					select product_code, max(date_modified) as MaxDate, product_size
					from PROD_PRICE_AVAILABILITY
					group by product_code, product_size
				) tm on t.product_code = tm.product_code and t.date_modified=tm.MaxDate and t.product_size=tm.product_size
				WHERE tm.product_code=p_code and t.product_size=p_size;
		subtotal = CAST(price.product_price as float);
		subtotal = cast((subtotal)*qty as float);
		insert into ORDER_DETAILS VALUES(ord_code, p_code, p_size, qty, subtotal);
		loc_res = 'OK';
	else
		loc_res = 'Order detail already exists.';
	end if;
	RETURN json_build_object(
		'status', loc_res
	);
end;
$$;

-- select ADD_ORDER_DETAILS('02', 'PZ-HW', '9', 2);
-- select ADD_ORDER_DETAILS('01', 'PZ-AC', '9', 2);
-- select ADD_ORDER_DETAILS('03', 'PZ-PP', '9', 2);


CREATE OR REPLACE FUNCTION UPDATE_ORDER_STATUS(ord_code varchar, status varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
	DECLARE
	loc_id text;
	loc_res text;
begin
	select into loc_id order_code from ORDERS where order_code = ord_code;
	if loc_id is not null then
		update ORDERS SET order_status=status WHERE order_code=ord_code;
		loc_res = 'OK';
	else
		loc_res = 'Order not found!';
	end if;
	RETURN json_build_object(
		'status', loc_res);
end;
$$;

-- select UPDATE_ORDER_STATUS('02', 'Preparing');
-- select UPDATE_ORDER_STATUS('01', 'Preparing');
-- select UPDATE_ORDER_STATUS('03', 'Preparing');

CREATE OR REPLACE FUNCTION GET_LIST_ORDER_CODES(status varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	order_list record;
	o_date date;
	loc_json_arr json[];
	loc_count bigint;
	loc_size int default 0;
begin
	select into loc_count count(order_status) from ORDERS where order_status = status;
	if loc_count != 0 then
		o_date = CAST(current_date as date);
		for order_list in SELECT order_code FROM ORDERS WHERE order_status=status AND order_date=o_date loop
			loc_json_arr = loc_json_arr ||
							json_build_object(
								'order_code', order_list.order_code
							);
			loc_size = loc_size + 1;
		end loop;
		RETURN json_build_object(
			'status', 'OK',
			'size', loc_size,
			'oder_codes', loc_json_arr
		);
	else
		RETURN json_build_object(
			'status', 'Orders not found!'
		);
	end if;
end;
$$;

-- select GET_LIST_ORDER_CODES('Preparing');

CREATE OR REPLACE FUNCTION GET_ORDER_DETAILS(ord_code varchar) RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	detail_order record;
	loc_record record;
	loc_json_arr json[];
	loc_size int default 0;
	loc_id text;
begin
	select into loc_id order_code from ORDERS where order_code = ord_code;
	if loc_id is not null then
		CREATE TEMP TABLE details ON COMMIT DROP AS
		select PRODUCTS.product_name, t.product_size, t.product_price, ORDER_DETAILS.quantity, ORDER_DETAILS.subtotal 
			from PROD_PRICE_AVAILABILITY t
			inner join (
				select product_code, max(date_modified) as MaxDate, product_size
				from PROD_PRICE_AVAILABILITY 
					group by product_code, product_size
					) tm on t.product_code = tm.product_code and t.date_modified = tm.MaxDate and t.product_size = tm.product_size
		LEFT JOIN PRODUCTS 
			ON PRODUCTS.product_code= t.product_code
		LEFT JOIN ORDER_DETAILS
			ON ORDER_DETAILS.product_code= t.product_code
		WHERE ORDER_DETAILS.order_code=ord_code and ORDER_DETAILS.product_size=t.product_size;
		for loc_record in select * from details loop
			loc_json_arr = loc_json_arr ||
							json_build_object(
							'product_name', loc_record.product_name,
							'product_size', loc_record.product_size,
							'product_prize', loc_record.product_price,
							'quantity', loc_record.quantity,
							'subtotal', loc_record.subtotal
							);
			loc_size = loc_size + 1;
		end loop;
		return json_build_object(
			'status', 'OK',
			'size', loc_size,
			'order_details', loc_json_arr
		);
	else
		return json_build_object(
			'status', 'Order not found!'
		);
	end if;
end;
$$;
-- select GET_ORDER_DETAILS('02')

CREATE OR REPLACE FUNCTION GET_ALL_ORDERS() RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	loc_prod_record record;
	loc_prod_json json[];
	loc_size int default 0;
begin
	for loc_prod_record in select * from orders where orders.order_status = 'COMPLETED' loop
		loc_prod_json = loc_prod_json ||
						json_build_object(
						'order_code', loc_prod_record.order_code,
						'order_date', loc_prod_record.order_date,
						'order_status', loc_prod_record.order_status,
						'customer_name', loc_prod_record.customer_name,
						'total_price', loc_prod_record.total_price
						);
		loc_size = loc_size + 1;
	end loop;
	
	return json_build_object(
		'status', 'OK',
		'size', loc_size,
		'orders', loc_prod_json
	);
end;
$$;

-- select get_all_orders();

CREATE OR REPLACE FUNCTION GET_ALL_ORDER_DETAILS() RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	loc_prod_record record;
	loc_prod_json json[];
	loc_size int default 0;
begin
	for loc_prod_record in 
	select 
		p.product_name, 
		order_details.order_code, 
		order_details.product_size, 
		order_details.quantity, 
		order_details.subtotal,
		orders.order_date
		from order_details  
		join products p on order_details.product_code = p.product_code
		join orders on order_details.order_code = orders.order_code
		loop
		loc_prod_json = loc_prod_json ||
						json_build_object(
						'order_code', loc_prod_record.order_code,
						'product_name', loc_prod_record.product_name,
						'product_size', loc_prod_record.product_size,
						'quantity', loc_prod_record.quantity,
						'subtotal', loc_prod_record.subtotal,
						'order_date', loc_prod_record.order_date
						);
		loc_size = loc_size + 1;
	end loop;
	
	return json_build_object(
		'status', 'OK',
		'size', loc_size,
		'order_details', loc_prod_json
	);
end;
$$;

CREATE OR REPLACE FUNCTION GET_USERS() RETURNS json
	LANGUAGE plpgsql
	AS $$
declare
	loc_prod_record record;
	loc_prod_json json[];
	loc_size int default 0;
begin
	for loc_prod_record in 
	select * from users loop
		loc_prod_json = loc_prod_json ||
						json_build_object(
						'user_name', loc_prod_record.user_name,
						'user_role', loc_prod_record.user_role,
						'user_image', loc_prod_record.user_image
						);
		loc_size = loc_size + 1;
	end loop;
	
	return json_build_object(
		'status', 'OK',
		'size', loc_size,
		'users', loc_prod_json
	);
end;
$$;