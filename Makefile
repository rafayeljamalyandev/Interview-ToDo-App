.PHONY: migrations

migrations:
	npx prisma migrate dev
test_db_connect:
	npx prisma db pull