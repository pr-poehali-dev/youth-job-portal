import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления откликами на вакансии
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
                SELECT user_id, job_id, user_name, user_email, user_age,
                       job_title, test_score, test_date, created_at
                FROM t_p86122027_youth_job_portal.job_responses
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            responses = []
            for row in rows:
                responses.append({
                    'userId': row[0],
                    'jobId': row[1],
                    'userName': row[2],
                    'userEmail': row[3],
                    'userAge': row[4],
                    'jobTitle': row[5],
                    'testScore': row[6],
                    'testDate': row[7].isoformat() if row[7] else None,
                    'timestamp': int(row[8].timestamp() * 1000) if row[8] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'responses': responses})
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO t_p86122027_youth_job_portal.job_responses 
                (user_id, job_id, user_name, user_email, user_age, 
                 job_title, test_score, test_date, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (user_id, job_id) DO NOTHING
                RETURNING id
            """, (
                body_data.get('userId'),
                body_data.get('jobId'),
                body_data.get('userName'),
                body_data.get('userEmail'),
                body_data.get('userAge'),
                body_data.get('jobTitle'),
                body_data.get('testScore'),
                body_data.get('testDate')
            ))
            
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'id': result[0] if result else None})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
