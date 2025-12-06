import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления вакансиями: создание, получение, обновление, удаление
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute("""
                SELECT id, title, company, location, type, salary, 
                       description, requirements, employer_id, employer_email, created_at
                FROM t_p86122027_youth_job_portal.jobs
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            jobs = []
            for row in rows:
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
                    'postedDate': row[10].isoformat() if row[10] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'jobs': jobs})
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO t_p86122027_youth_job_portal.jobs 
                (id, title, company, location, type, salary, description, 
                 requirements, employer_id, employer_email, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
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
                body_data.get('employerEmail')
            ))
            
            job_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': job_id})
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                UPDATE t_p86122027_youth_job_portal.jobs 
                SET title = %s, company = %s, location = %s, type = %s, 
                    salary = %s, description = %s, requirements = %s, 
                    employer_id = %s, employer_email = %s, updated_at = NOW()
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
                body_data.get('id')
            ))
            
            result = cur.fetchone()
            if not result:
                conn.rollback()
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Job not found'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': result[0]})
            }
        
        if method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            job_id = body_data.get('id')
            
            if not job_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Job ID required'})
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
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Job not found'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': result[0], 'message': 'Job deleted'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()