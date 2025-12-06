import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления вакансиями: создание, получение, обновление, удаление
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Общие CORS заголовки
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
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
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
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'jobs': jobs}),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            coordinates = body_data.get('coordinates', [56.0184, 92.8672])
            coords_json = json.dumps(coordinates)
            
            contact = body_data.get('contact', {})
            
            cur.execute("""
                INSERT INTO t_p86122027_youth_job_portal.jobs 
                (id, title, company, location, type, salary, description, 
                 requirements, employer_id, employer_email, created_at, updated_at,
                 age_range, category, coordinates, is_premium, 
                 responsibilities, conditions, contact_phone, contact_email)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW(),
                        %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                body_data.get('id'),
                body_data.get('title'),
                body_data.get('company'),
                body_data.get('location'),
                body_data.get('type'),
                body_data.get('salary'),
                body_data.get('description'),
                body_data.get('requirements', []),
                body_data.get('employerId'),
                body_data.get('employerEmail'),
                body_data.get('ageRange', '14-17'),
                body_data.get('category', 'Работа с людьми'),
                coords_json,
                body_data.get('isPremium', False),
                body_data.get('responsibilities', []),
                body_data.get('conditions', []),
                contact.get('phone', '+7 (391) 234-56-78'),
                contact.get('email', body_data.get('employerEmail', 'hr@company.ru'))
            ))
            
            job_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': job_id}),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            coordinates = body_data.get('coordinates', [56.0184, 92.8672])
            coords_json = json.dumps(coordinates)
            
            contact = body_data.get('contact', {})
            
            cur.execute("""
                UPDATE t_p86122027_youth_job_portal.jobs 
                SET title = %s, company = %s, location = %s, type = %s, 
                    salary = %s, description = %s, requirements = %s, 
                    employer_id = %s, employer_email = %s, updated_at = NOW(),
                    age_range = %s, category = %s, coordinates = %s, is_premium = %s,
                    responsibilities = %s, conditions = %s, contact_phone = %s, contact_email = %s
                WHERE id = %s
                RETURNING id
            """, (
                body_data.get('title'),
                body_data.get('company'),
                body_data.get('location'),
                body_data.get('type'),
                body_data.get('salary'),
                body_data.get('description'),
                body_data.get('requirements', []),
                body_data.get('employerId'),
                body_data.get('employerEmail'),
                body_data.get('ageRange', '14-17'),
                body_data.get('category', 'Работа с людьми'),
                coords_json,
                body_data.get('isPremium', False),
                body_data.get('responsibilities', []),
                body_data.get('conditions', []),
                contact.get('phone', '+7 (391) 234-56-78'),
                contact.get('email', body_data.get('employerEmail', 'hr@company.ru')),
                body_data.get('id')
            ))
            
            result = cur.fetchone()
            if not result:
                conn.rollback()
                return {
                    'statusCode': 404,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Job not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': result[0]}),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            job_id = body_data.get('id')
            
            if not job_id:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Job ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                DELETE FROM t_p86122027_youth_job_portal.jobs 
                WHERE id = %s
                RETURNING id
            """, (job_id,))
            
            result = cur.fetchone()
            if not result:
                conn.rollback()
                return {
                    'statusCode': 404,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Job not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': result[0], 'message': 'Job deleted'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()