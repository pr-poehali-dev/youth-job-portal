import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления вакансиями: создание, получение, обновление, удаление
    '''
    method: str = event.get('httpMethod', 'GET')
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        if method == 'GET':
            print("Fetching all jobs from database")
            cur.execute("""
                SELECT id, title, company, location, type, salary, 
                       description, requirements, employer_id, employer_email, created_at,
                       age_range, category, coordinates, is_premium, 
                       responsibilities, conditions, contact_phone, contact_email
                FROM t_p86122027_youth_job_portal.jobs
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            jobs = []
            for row in rows:
                coords_str = row[13] or '[56.0184, 92.8672]'
                try:
                    coordinates = json.loads(coords_str)
                except:
                    coordinates = [56.0184, 92.8672]
                
                jobs.append({
                    'id': row[0],
                    'title': row[1],
                    'company': row[2],
                    'location': row[3],
                    'type': row[4],
                    'salary': row[5],
                    'description': row[6],
                    'requirements': row[7] or [],
                    'employerId': row[8],
                    'employerEmail': row[9],
                    'postedDate': row[10].isoformat() if row[10] else None,
                    'ageRange': row[11] or '14-17',
                    'category': row[12] or 'Работа с людьми',
                    'coordinates': coordinates,
                    'isPremium': row[14] or False,
                    'responsibilities': row[15] or [],
                    'conditions': row[16] or [],
                    'contact': {
                        'phone': row[17] or '+7 (391) 234-56-78',
                        'email': row[18] or 'hr@company.ru'
                    }
                })
            
            print(f"Returning {len(jobs)} jobs")
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'jobs': jobs}),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            job_id = str(body_data.get('id', '')).replace("'", "''")
            title = str(body_data.get('title', '')).replace("'", "''")
            company = str(body_data.get('company', '')).replace("'", "''")
            location = str(body_data.get('location', '')).replace("'", "''")
            job_type = str(body_data.get('type', '')).replace("'", "''")
            salary = str(body_data.get('salary', '')).replace("'", "''")
            description = str(body_data.get('description', '')).replace("'", "''")
            requirements = json.dumps(body_data.get('requirements', [])).replace("'", "''")
            employer_id = str(body_data.get('employerId', '')).replace("'", "''")
            employer_email = str(body_data.get('employerEmail', '')).replace("'", "''")
            age_range = str(body_data.get('ageRange', '14-17')).replace("'", "''")
            category = str(body_data.get('category', 'Работа с людьми')).replace("'", "''")
            
            coordinates = body_data.get('coordinates', [56.0184, 92.8672])
            coords_json = json.dumps(coordinates).replace("'", "''")
            
            is_premium = 'true' if body_data.get('isPremium', False) else 'false'
            
            responsibilities = json.dumps(body_data.get('responsibilities', [])).replace("'", "''")
            conditions = json.dumps(body_data.get('conditions', [])).replace("'", "''")
            
            contact = body_data.get('contact', {})
            contact_phone = str(contact.get('phone', '+7 (391) 234-56-78')).replace("'", "''")
            contact_email = str(contact.get('email', employer_email or 'hr@company.ru')).replace("'", "''")
            
            print(f"Creating job: {title}")
            
            cur.execute(f"""
                INSERT INTO t_p86122027_youth_job_portal.jobs 
                (id, title, company, location, type, salary, description, 
                 requirements, employer_id, employer_email, created_at, updated_at,
                 age_range, category, coordinates, is_premium, 
                 responsibilities, conditions, contact_phone, contact_email)
                VALUES ('{job_id}', '{title}', '{company}', '{location}', '{job_type}', 
                        '{salary}', '{description}', '{requirements}', '{employer_id}', 
                        '{employer_email}', NOW(), NOW(), '{age_range}', '{category}', 
                        '{coords_json}', {is_premium}, '{responsibilities}', '{conditions}', 
                        '{contact_phone}', '{contact_email}')
                RETURNING id
            """)
            
            result = cur.fetchone()
            conn.commit()
            
            print(f"Job created successfully: {result[0]}")
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': result[0]}),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            job_id = str(body_data.get('id', '')).replace("'", "''")
            title = str(body_data.get('title', '')).replace("'", "''")
            company = str(body_data.get('company', '')).replace("'", "''")
            location = str(body_data.get('location', '')).replace("'", "''")
            job_type = str(body_data.get('type', '')).replace("'", "''")
            salary = str(body_data.get('salary', '')).replace("'", "''")
            description = str(body_data.get('description', '')).replace("'", "''")
            requirements = json.dumps(body_data.get('requirements', [])).replace("'", "''")
            employer_id = str(body_data.get('employerId', '')).replace("'", "''")
            employer_email = str(body_data.get('employerEmail', '')).replace("'", "''")
            age_range = str(body_data.get('ageRange', '14-17')).replace("'", "''")
            category = str(body_data.get('category', 'Работа с людьми')).replace("'", "''")
            
            coordinates = body_data.get('coordinates', [56.0184, 92.8672])
            coords_json = json.dumps(coordinates).replace("'", "''")
            
            is_premium = 'true' if body_data.get('isPremium', False) else 'false'
            
            responsibilities = json.dumps(body_data.get('responsibilities', [])).replace("'", "''")
            conditions = json.dumps(body_data.get('conditions', [])).replace("'", "''")
            
            contact = body_data.get('contact', {})
            contact_phone = str(contact.get('phone', '+7 (391) 234-56-78')).replace("'", "''")
            contact_email = str(contact.get('email', employer_email or 'hr@company.ru')).replace("'", "''")
            
            print(f"Updating job: {job_id}")
            
            cur.execute(f"""
                UPDATE t_p86122027_youth_job_portal.jobs 
                SET title = '{title}', company = '{company}', location = '{location}', 
                    type = '{job_type}', salary = '{salary}', description = '{description}', 
                    requirements = '{requirements}', employer_id = '{employer_id}', 
                    employer_email = '{employer_email}', updated_at = NOW(),
                    age_range = '{age_range}', category = '{category}', 
                    coordinates = '{coords_json}', is_premium = {is_premium},
                    responsibilities = '{responsibilities}', conditions = '{conditions}', 
                    contact_phone = '{contact_phone}', contact_email = '{contact_email}'
                WHERE id = '{job_id}'
                RETURNING id
            """)
            
            result = cur.fetchone()
            if not result:
                conn.rollback()
                return {
                    'statusCode': 404,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Job not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            print(f"Job updated successfully: {result[0]}")
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': result[0]}),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            job_id = str(body_data.get('id', '')).replace("'", "''")
            
            if not job_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Job ID required'}),
                    'isBase64Encoded': False
                }
            
            print(f"Deleting job: {job_id}")
            
            cur.execute(f"""
                DELETE FROM t_p86122027_youth_job_portal.jobs 
                WHERE id = '{job_id}'
                RETURNING id
            """)
            
            result = cur.fetchone()
            if not result:
                conn.rollback()
                return {
                    'statusCode': 404,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Job not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            print(f"Job deleted successfully: {result[0]}")
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': result[0], 'message': 'Job deleted'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
