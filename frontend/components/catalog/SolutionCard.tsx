import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardDescription } from '../ui/card'

const SolutionCard = () => {
  return (
    <Link href={`/catalog/`}>
        <Card className='group h-full transition-all duration-200 '>
            <CardHeader
                className="pb-3"
            >


            </CardHeader>
        </Card>
    </Link>
  )
}

export default SolutionCard
